# Run locally

## Using Python (Built-in Web Server)

Open PowerShell or your terminal in c:\GIT\fidlers.github.io and run:

powershell    python -m http.server 8000
Then open your browser and go to: 👉 <http://localhost:8000>

# Steps to Convert fidlers.com (Namecheap) from Google Sites to fidlers.github.io

## Quick Reference: Run Locally

In PowerShell:

```powershell
python -m http.server 8000
```

Then open browser to: 👉 <http://localhost:8000>

---

## How to Point Custom Domain (`fidlers.com`) to GitHub Pages

Follow these steps to transition your domain **`fidlers.com`** hosted at **Namecheap** from your old Google Site to **`fidlers.github.io`**.

---

### Step 1: Log in to Namecheap

1. Go to [https://www.namecheap.com](https://www.namecheap.com) and sign in.
2. Go to your **Dashboard** or click **Domain List** in the left menu.
3. Locate **`fidlers.com`** and click the **Manage** button on the right.
4. Click on the **Advanced DNS** tab at the top.

---

### Step 2: Remove Old Google Sites Records

Under the **Host Records** table:

1. Find any existing records pointing to Google Sites:
   - A **CNAME Record** with Host `www` (or `@`) pointing to `ghs.googlehosted.com`.
   - Any Google site verification **TXT** records (if no longer needed).
2. Click the **Trash / Delete** icon to remove them so they don't conflict.

---

### Step 3: Add GitHub Pages DNS Records (Namecheap)

Add the following records under **Host Records**:

#### A. Apex Domain A Records (points `fidlers.com` to GitHub)

Click **Add New Record** for each of the 4 GitHub IP addresses:

| Type | Host | Value / IP Address | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `185.199.108.153` | Automatic |
| **A Record** | `@` | `185.199.109.153` | Automatic |
| **A Record** | `@` | `185.199.110.153` | Automatic |
| **A Record** | `@` | `185.199.111.153` | Automatic |

#### B. CNAME Record (points `www.fidlers.com` to GitHub)

Click **Add New Record**:

| Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME Record** | `www` | `fidlers.github.io.` | Automatic |

*(Note: If Namecheap rejects the dot at the end, enter `fidlers.github.io` without the dot).*

Click **Save all changes**.

---

### Step 4: Configure Custom Domain in GitHub

1. Go to your GitHub repository:
   👉 **<https://github.com/DennyFid/fidlers.github.io>**
2. Click **Settings** (top menu bar) -> **Pages** (left sidebar).
3. Under **Custom domain**, type:

   ```text
   fidlers.com
   ```

4. Click **Save**.
   - GitHub will verify the DNS records and automatically commit a `CNAME` file to the root of your repo.

---

### Step 5: Enforce HTTPS (SSL Certificate)

1. On the same GitHub Pages settings page, wait until the DNS check displays: **"DNS check successful"**.
2. Check the box for **Enforce HTTPS**.
   *(Note: Certificate generation can take 15–30 minutes. If the checkbox is greyed out initially, check back shortly).*

---

### Step 6: Verify Propagation

DNS propagation typically takes 15–30 minutes (up to 24 hours in rare cases).

You can check DNS status in PowerShell:

```powershell
Resolve-DnsName fidlers.com -Type A
Resolve-DnsName www.fidlers.com -Type CNAME
```

Or check globally at:
👉 **<https://dnschecker.org/#A/fidlers.com>**
