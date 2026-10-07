# Studio Management — Login

## 1. Purpose

The Login screen is the entry point for Studio Management.

The screen must feel premium, warm, simple, and trustworthy. It should look like a creative studio management product rather than a generic corporate SaaS application.

Primary goal:

* Allow an existing user to sign in quickly.
* Support email/password authentication.
* Provide clear validation and error states.
* Provide navigation to account creation and password recovery.

---

## 2. Visual Direction

Use the Studio Management design system:

* Background: warm ivory `#FBF8F2`
* Card: white `#FFFFFF`
* Primary text: warm espresso `#3A2925`
* Secondary text: warm taupe `#806F68`
* Accent: champagne gold `#C6A15B`
* Error: muted burgundy
* Border: `#E9E0D6`

The design should be:

* Bright
* Warm
* Minimal
* Premium
* Elegant
* Modern
* Photography/video-studio oriented

Avoid:

* Dark dashboard aesthetics
* Neon colors
* Excessive gradients
* Glassmorphism
* Excessive wedding decorations
* Large photographic backgrounds that reduce readability

---

## 3. Layout

### Desktop / Tablet

Centered authentication card.

Structure:

1. Studio Management logo/name
2. Short tagline
3. Login form
4. Forgot password
5. Login button
6. Divider
7. Create account action

### Mobile

Use a single-column layout with comfortable horizontal padding.

Authentication card should not feel like a floating desktop card. It can become a full-width content area.

---

## 4. Content

Brand:

**Studio Management**

Tagline:

**Manage. Shoot. Deliver.**

Heading:

**Welcome back**

Supporting text:

**Sign in to manage your studio, projects, clients, and production workflow.**

Fields:

### Email

Placeholder:

`Enter your email`

### Password

Placeholder:

`Enter your password`

Password visibility toggle must be available.

Actions:

**Forgot password?**

Primary CTA:

**Sign In**

Secondary CTA:

**Create an account**

---

## 5. Validation

Email:

* Required
* Must have valid email format

Password:

* Required

Validation should happen both on field interaction and form submission.

Do not show aggressive validation before the user interacts with a field.

Example:

`Please enter your email.`

`Please enter a valid email address.`

`Please enter your password.`

---

## 6. Loading State

When the user taps Sign In:

* Disable the submit button.
* Show loading indicator.
* Prevent duplicate submission.
* Preserve entered values.

Button state:

`Signing in...`

---

## 7. Authentication Error

If authentication fails:

Display a clear message:

**Incorrect email or password. Please try again.**

Do not expose backend authentication details.

Allow the user to retry immediately.

---

## 8. Navigation

Successful login:

`Login → Home`

Forgot password:

`Login → Forgot Password`

Create account:

`Login → Create Account`

---

## 9. Responsive Requirements

### Small phone: 320–374px

* Single column
* Full-width form controls
* Minimum 44px touch target
* No horizontal scrolling

### Standard phone: 375–599px

* Single column
* Comfortable spacing
* CTA remains visible without excessive scrolling

### Tablet: 600–839px

* Centered authentication content
* Maximum form width approximately 420px

### Large tablet / desktop: 840px+

* Centered authentication panel
* Maximum content width approximately 440px

---

## 10. Accessibility

* Labels must remain accessible even when placeholders are used.
* Keyboard navigation must work.
* Password visibility toggle must have an accessible label.
* Error messages must be associated with their fields.
* Primary CTA must have sufficient contrast.
* Touch targets should be at least 44×44px.

---

## 11. Success Criteria

The Login screen is complete when:

* User can enter email/password.
* Validation works correctly.
* Loading state works.
* Authentication errors are handled.
* Successful authentication navigates to Home.
* Forgot password navigation works.
* Create account navigation works.
* Layout works on phone, tablet, and desktop.
