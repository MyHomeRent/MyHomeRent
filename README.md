# Myhomerent setup (all steps)
1. Firebase console: create project. Enable Authentication > Email/Password and Firestore Database.
2. Project settings > Your apps > Web app. Paste the config into `js/firebase.js`.
3. Create the admin FIRST: Authentication > Users > Add user, email pranavpande43@gmail.com (lowercase) + a strong password. Only this email is admin (enforced by firestore.rules). Log in on the site with that email.
4. Deploy: `npm i -g firebase-tools`, `firebase login`, `firebase use --add`, `firebase deploy --only hosting,firestore`.
5. Push this folder to GitHub. Repo > Settings > Secrets > Actions, add:
   - FIREBASE_SERVICE_ACCOUNT: Project settings > Service accounts > Generate new private key (paste the whole JSON)
   - SMSGATE_USER, SMSGATE_PASS: shown on the home screen of the "SMS Gateway for Android" app (Cloud mode)
6. Phone: install SMS Gateway for Android, start it in Cloud mode, keep it on with data. Run the workflow once (Actions > Run workflow) to test.
7. Verify the SMS client call in scripts/send-sms.js against https://docs.sms-gate.app (API may change).
Notes: SMS is plain text, so put UPI ID / bank text (or a link) in Payment details, not a QR image. Renters are added from the admin page (phone + password).
GitHub pauses scheduled workflows after 60 days without repo activity; push a small commit to restart.

Receipts: after marking a payment Received, admin taps 'Send receipt' (PDF, shared to WhatsApp). Renters can download their own receipts. Re-publish firestore.rules after updating.
