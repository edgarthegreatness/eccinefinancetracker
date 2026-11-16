EC Project and Finance Tracker - installable app with offline use and sync

Folder
  public/                the app (index.html, manifest, service worker, icons)
  netlify/functions/     the small server part that does the syncing
  netlify.toml, package.json   Netlify settings

Put it on Netlify (GitHub way)
  1. Make a free account on github.com. Create a new private repository.
  2. In the repository choose Add file > Upload files. Unzip this package first,
     then drag in everything inside the folder, keeping the folders as they are.
     Click Commit changes.
  3. Go to app.netlify.com. Add new site > Import an existing project > GitHub.
     Pick the repository. Leave the build command empty. Click Deploy.
  4. In Netlify open Site configuration > Environment variables > Add a variable.
     Name:  SYNC_KEY
     Value: a long private phrase, 30 or more characters. This is your password.
     Save, then go to Deploys > Trigger deploy > Deploy site.

Use it
  1. Open your Netlify link on each device.
  2. Overview > Sync > paste the same sync key > Sync now.
  3. Install it:
       iPhone (Safari): Share > Add to Home Screen
       Android (Chrome): menu > Install app
       PC or laptop (Chrome or Edge): the install icon in the address bar

Without sync
  If you only want the app and no syncing, open app.netlify.com/drop and drop
  the "public" folder onto it. Each device then keeps its own data.

How syncing works
  - Changes are saved on the device first, so nothing is lost offline.
  - It syncs when you open the app, when the internet comes back, a moment after
    each change, and every 2 minutes while the app is open.
  - If two devices change the same project or expense, the newest edit wins.
  - Deleting something on one device deletes it on the others.

Moving your old data in
  Old app: Overview > Export, copy the backup. New app: Overview > Import, paste.
