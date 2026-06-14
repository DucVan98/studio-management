# UX Review — Luồng Onboarding Everly

> Review date: 2026-06-13 (lần 1) · 2026-06-13 (lần 2)  
> Reviewer: Claude (UX analysis)  
> Scope: Toàn bộ luồng onboarding từ Welcome → Connected

---

## Bản đồ luồng hiện tại

### User 1 (người tạo invite)

```
Welcome → Register → VerifyEmail → ProfileSetup → StartDate → Invite → (SSE) → App
```

### User 2 (người nhận invite)

```
Welcome → Register → VerifyEmail → ProfileSetup → StartDate → Invite → EnterCode → PartnerAccept → Connected → App
```

---

## 🔴 Critical Issues — Phá vỡ tính năng

### 1. StartDate không save dữ liệu

**File:** `src/screens/onboarding/StartDateScreen.tsx`

**Vấn đề:** `handleContinue` chỉ `navigation.navigate('Invite')` mà không gọi bất kỳ usecase hay action nào. Ngày user chọn bị mất hoàn toàn.

```ts
// ❌ Hiện tại
const handleContinue = () => {
  navigation.navigate('Invite'); // Ngày chọn bị drop ở đây
};
```

**Fix:**
```ts
// ✅ Fix
const handleContinue = async () => {
  await DIContainer.getInstance()
    .getSaveRelationshipDateUseCase()
    .execute({ date: selected.toISOString().slice(0, 10), type: dateType });
  // Hoặc dùng onboardingStore$ nếu chưa muốn API call tại đây
  onboardingActions.setStartDate({ date: selected, type: dateType });
  navigation.navigate('Invite');
};
```

**Usecase có sẵn:** `src/domain/usecases/onboarding/SaveRelationshipDateUseCase.ts` — đã implement nhưng chưa được gọi.

---

### 2. PartnerAccept hiển thị sai ngày bắt đầu

**File:** `src/screens/onboarding/PartnerAcceptScreen.tsx`

**Vấn đề:** Màn này fetch `invite.createdAt` (ngày invite được tạo) và dùng làm `startDate`. Điều này sai hoàn toàn — nếu User1 chọn "Ngày yêu: 3 năm trước" thì User2 sẽ thấy ngày hôm nay.

```ts
// ❌ Hiện tại — dùng ngày tạo invite
const date = invite.createdAt.slice(0, 10); // ← sai
setStartDate(date);
```

**Root cause:** `StartDateScreen` không save ngày nên invite payload không chứa startDate. Sau khi fix issue #1:

```ts
// ✅ API nên trả về startDate từ profile User1
const date = invite.startDate ?? invite.createdAt.slice(0, 10);
```

**Backend cần:** `GET /invites/:code` trả thêm field `startDate` (ngày User1 đã chọn).

---

### 3. User1 không có màn Connected (celebration asymmetry)

**File:** `src/screens/onboarding/InviteScreen.tsx`

**Vấn đề:** Khi User2 accept, SSE callback trên máy User1 chạy:

```ts
// ❌ Hiện tại — User1 bị văng thẳng vào App
navigation.reset({ index: 0, routes: [{ name: 'App' }] });
```

User2 được màn `Connected` với celebration. User1 không có gì. Đây là emotional peak của cả sản phẩm — cả hai người phải được trải nghiệm.

**Fix:**

```ts
// ✅ SSE callback nên navigate tới Connected, không phải App
.watch(code, (event) => {
  navigation.reset({
    index: 0,
    routes: [{
      name: 'Connected',
      params: { partnerName: event.partnerName, startDate: event.startDate }
    }],
  });
});
```

**Backend cần:** SSE event `accepted` trả thêm `{ partnerName, startDate }`.

---

## 🟡 Major Issues — UX friction nghiêm trọng

### 4. ProfileSetup: validation error silent

**File:** `src/screens/onboarding/ProfileSetupScreen.tsx`

**Vấn đề:** Khi `name` rỗng, bấm "Tiếp tục" không có phản hồi gì — hàm chỉ `return` âm thầm. User không biết tại sao không qua được màn.

```ts
// ❌ Hiện tại
const handleContinue = () => {
  if (!name.trim()) {
    return; // ← silent failure, không có feedback
  }
  ...
};
```

**Fix:**

```ts
// ✅
const [errorMsg, setErrorMsg] = useState<string | null>(null);

const handleContinue = () => {
  if (!name.trim()) {
    setErrorMsg('Vui lòng nhập tên của bạn');
    return;
  }
  setErrorMsg(null);
  ...
};

// Trong JSX:
{errorMsg && <Alert type="error" title={errorMsg} onClose={() => setErrorMsg(null)} />}
```

---

### 5. StartDate của User2 bị ignore hoàn toàn

**Vấn đề:** User2 cũng đi qua `StartDateScreen` và chọn ngày — nhưng ngày đó không được dùng. Khi sang `PartnerAccept`, ngày hiển thị là từ invite của User1 (hoặc sai như issue #2). Màn StartDate của User2 không có mục đích.

**Hai lựa chọn:**

**Option A (Recommended):** Bỏ `StartDateScreen` khỏi flow của User2. User2 xem và confirm ngày User1 đã chọn ngay trong `PartnerAcceptScreen` — đủ context, ít bước hơn.

**Option B:** Cho User2 chọn ngày riêng ở `PartnerAcceptScreen` (editable field), sau đó negotiate giữa hai bên.

Flow hiện tại (User2 chọn ngày xong bị bỏ qua) là trải nghiệm tệ nhất — tốn thời gian user mà không có kết quả.

---

### 6. "Từ chối" ở PartnerAccept navigate về App

**File:** `src/screens/onboarding/PartnerAcceptScreen.tsx`

**Vấn đề:** Bấm "Từ chối" → `navigation.reset({ routes: [{ name: 'App' }] })`. User vào App mà không có couple, mọi feature yêu cầu couple đều broken/empty.

```ts
// ❌ Hiện tại
<TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'App' }] })}>
  <Text>Từ chối</Text>
</TouchableOpacity>
```

**Fix:** Navigate về `Invite` (để User2 có thể tạo invite của chính họ) hoặc về `Welcome`.

```ts
// ✅
onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Invite' }] })}
```

---

### 7. Avatar "coming soon" là distraction ở thời điểm quan trọng

**File:** `src/screens/onboarding/ProfileSetupScreen.tsx`

**Vấn đề:** Camera icon trên avatar → Alert "Sắp ra mắt". Đây là màn đầu tiên user tương tác sau khi đăng ký. Gặp ngay feature chưa làm → giảm trust.

**Fix:** Ẩn camera icon hoàn toàn cho đến khi có feature. Không cần placeholder cho tính năng chưa implement.

```tsx
// ❌ Bỏ đi:
<View className="absolute bottom-0 right-0 w-9 h-9 rounded-pill bg-accent ...">
  <Icon name="camera" ... />
</View>
```

---

## ⚪ Minor Issues — Polish

### 8. Connected screen thiếu animation

**File:** `src/screens/onboarding/ConnectedScreen.tsx`

Đây là emotional peak của onboarding — cả hai user cuối cùng được kết nối. Confetti hiện tại là static `View` với màu hardcoded, không có animation.

**Gợi ý:**
- Dùng `FadeIn` layout animation (Reanimated) cho hai avatar
- Confetti nên có `useAnimatedStyle` với translateY/opacity để rơi xuống
- Stat card có thể fade in sau avatar 300ms

---

### 9. Progress dots hardcoded trong InviteScreen

**File:** `src/screens/onboarding/InviteScreen.tsx`

```tsx
// ❌ Hiện tại — hardcode 5 dots, chỉ màn này có
{[0, 1, 2, 3, 4].map((i) => (
  <View className={`... ${i === 4 ? 'w-5 bg-accent' : 'w-1.5 bg-border'}`} />
))}
```

Nếu muốn dùng progress indicator, nên tạo component `<OnboardingProgress step={4} total={5} />` dùng chung cho tất cả màn.

---

### 10. "Để sau" quá dễ bỏ qua couple setup

**File:** `src/screens/onboarding/InviteScreen.tsx`

User1 có thể bỏ qua toàn bộ couple linking và vào App. Nếu core features (memories, milestones, stats) đều cần `coupleId`, trải nghiệm sẽ rất nghèo.

**Gợi ý:** Trong App, nếu `coupleId` null → hiển thị banner/empty state nhắc user kết nối với partner, có CTA dẫn về `Invite` screen.

---

## Thứ tự fix ưu tiên

| # | Issue | File | Effort |
|---|-------|------|--------|
| 1 | StartDate không save | `StartDateScreen.tsx` | S |
| 2 | PartnerAccept sai ngày (cần fix #1 + backend) | `PartnerAcceptScreen.tsx` | M |
| 3 | User1 không có Connected screen (cần backend SSE payload) | `InviteScreen.tsx` | M |
| 4 | ProfileSetup silent validation | `ProfileSetupScreen.tsx` | XS |
| 5 | Bỏ StartDate khỏi flow User2 | Navigation | S |
| 6 | "Từ chối" sai đích | `PartnerAcceptScreen.tsx` | XS |
| 7 | Ẩn camera icon coming soon | `ProfileSetupScreen.tsx` | XS |
| 8 | Connected animation | `ConnectedScreen.tsx` | M |
| 9 | Progress dots component | Component mới | S |
| 10 | Empty state khi không có couple | Home/App | L |

---

## Backend changes cần thiết

1. `POST /invites` — nhận thêm `{ startDate: string, dateType: 'love' | 'wedding' | 'first-meet' }` từ User1
2. `GET /invites/:code` — trả thêm `startDate`, `dateType` trong response
3. SSE event `accepted` — trả thêm `{ partnerName: string, startDate: string }` để User1 navigate về Connected với đủ params

Xem chi tiết contract tại `everly-api-spec.md`.

---

---

## Review lần 2 — Deep Link Flow (2026-06-13)

> Trigger: Xem screenshot màn Invite, đặt câu hỏi về flow khi User 2 bấm link `everly://join/:code` khi chưa mở app.

### Cơ chế hiện tại

App đã config deep link đúng trong `App.tsx`:

```ts
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['everly://', 'https://everly.app'],
  config: {
    screens: {
      PartnerAccept: 'join/:code',
    },
  },
};
```

`everly://join/XD7XLZPJ` và `https://everly.app/join/XD7XLZPJ` đều map tới `PartnerAccept { code }`.

### Các case và kết quả hiện tại

| Case | Kết quả |
|------|---------|
| App chưa cài | Mở App Store. Sau khi cài + mở → **link bị mất** (không có deferred deep link) |
| App cài rồi, đã login | Link mở thẳng `PartnerAccept` ✅ |
| App cài rồi, **chưa login** | App mở ở `Welcome`, code trong link **bị bỏ qua hoàn toàn** ❌ |

### So sánh: bấm link vs nhập mã thủ công

| | Bấm link | Mở app → "Tôi nhận được mã mời" |
|---|---|---|
| Số bước | ~1 | 4+ (mở app → onboard → Invite → EnterCode → nhập code) |
| Nhập tay | Không | Có (risk typo) |
| Xem inviter info | Ngay lập tức | Sau khi nhập xong |
| Hoạt động khi chưa login | ❌ Hiện tại | ✅ Luôn hoạt động |

Deep link là flow tốt hơn nhiều về UX — nhưng **mất hết lợi thế nếu user chưa có tài khoản**.

### 🔴 Issue mới phát hiện: Pending invite code bị drop khi chưa auth

**File:** `App.tsx`, `src/screens/auth/VerifyEmailScreen.tsx`

**Vấn đề:** Khi User 2 bấm link nhưng chưa có tài khoản:
1. App mở → `initialRouteName = 'Welcome'` (đúng)
2. React Navigation nhận deep link URL, thử navigate tới `PartnerAccept`
3. Nhưng user chưa auth → flow bị broken hoặc code bị drop
4. User phải tự tìm "Tôi nhận được mã mời" và nhập lại → mất hết lợi thế của link

**Fix — Pending invite pattern:**

```ts
// App.tsx — trong bootstrap(), trước khi set initialRouteName
import * as Linking from 'expo-linking';

const initialUrl = await Linking.getInitialURL();
const joinMatch = initialUrl?.match(/\/join\/([A-Z0-9]+)/i);
if (joinMatch) {
  onboardingActions.setPendingInviteCode(joinMatch[1]);
}
```

```ts
// src/stores/onboarding.store.ts — thêm field
pendingInviteCode: observable<string | null>(null),
```

```ts
// src/screens/auth/VerifyEmailScreen.tsx — sau khi verify xong
const pendingCode = onboardingStore$.pendingInviteCode.peek();
if (pendingCode) {
  onboardingActions.setPendingInviteCode(null);
  navigation.reset({
    index: 0,
    routes: [{ name: 'PartnerAccept', params: { code: pendingCode } }],
  });
} else {
  navigation.navigate('ProfileSetup');
}
```

Với pattern này, User 2 bấm link → Register → VerifyEmail → tự động vào `PartnerAccept` với đúng code, không cần nhập tay.

### Bonus: Deferred deep link (app chưa cài)

Khi app chưa được cài, link mở App Store và code bị mất. Fix chuẩn là dùng **Branch.io** hoặc **Firebase Dynamic Links** để lưu code trong install attribution. Phức tạp hơn, để backlog — không critical cho MVP.

---

## Knowledge — Pattern cần nhớ cho future features

### Asymmetric flow (hai user làm việc khác nhau)
Mọi feature có 2 actor (sender/receiver) cần đảm bảo **cả hai** có complete experience. Kiểm tra:
- Actor A có celebration/confirmation không?
- Actor B có context đầy đủ không (tên, avatar, ngày tháng)?
- Khi flow kết thúc, cả hai đều navigate về đúng đích?

### Data hand-off giữa các màn onboarding
Onboarding là stateful flow — data từ màn trước phải được persist trước khi navigate. Convention của project:
- Dùng `onboardingStore$` (`src/stores/onboarding.store.ts`) để hold state tạm
- Hoặc gọi usecase ngay tại màn đó nếu cần persist phía server
- **Không** dùng navigation params để pass data giữa nhiều màn — dễ bị drop

### Validation UX
Theo convention của project (xem CLAUDE.md):
- Dùng `<Alert type="error" />` inline, không dùng `Alert` của React Native
- Validation error phải visible — không được silent return
- Set error state trước khi return sớm
