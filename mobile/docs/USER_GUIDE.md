# Bihar Land Survey Mobile App - User Guide

## बिहार भूमि सर्वेक्षण मोबाइल ऐप - उपयोगकर्ता गाइड

---

## Table of Contents

1. [Introduction / परिचय](#introduction)
2. [Getting Started / शुरुआत करें](#getting-started)
3. [App Features / ऐप की विशेषताएं](#app-features)
4. [How to Search / खोज कैसे करें](#how-to-search)
5. [Viewing Property Details / संपत्ति विवरण देखना](#viewing-property-details)
6. [Document Viewing / दस्तावेज़ देखना](#document-viewing)
7. [Troubleshooting / समस्या निवारण](#troubleshooting)
8. [FAQ / अक्सर पूछे जाने वाले प्रश्न](#faq)

---

## Introduction

### English
The Bihar Land Survey Mobile App (बिहार भूमि) is an official application developed for the Department of Revenue and Land Reforms, Government of Bihar. This app allows citizens to:

- Search for their land records using mobile number, Aadhaar number, or Property ID
- View complete property details including boundaries
- Access and download property-related documents
- Check survey status for the year 2023

### हिंदी
बिहार भूमि सर्वेक्षण मोबाइल ऐप बिहार सरकार के राजस्व और भूमि सुधार विभाग के लिए विकसित एक आधिकारिक एप्लिकेशन है। यह ऐप नागरिकों को निम्नलिखित सुविधाएं प्रदान करता है:

- मोबाइल नंबर, आधार नंबर या प्रॉपर्टी आईडी से भूमि रिकॉर्ड खोजें
- सीमाओं सहित पूर्ण संपत्ति विवरण देखें
- संपत्ति से संबंधित दस्तावेज़ देखें और डाउनलोड करें
- वर्ष 2023 के लिए सर्वेक्षण स्थिति जांचें

---

## Getting Started

### System Requirements / सिस्टम आवश्यकताएं

| Requirement | Specification |
|-------------|---------------|
| Operating System | Android 6.0 (Marshmallow) or higher |
| RAM | Minimum 2 GB |
| Storage | 50 MB free space |
| Internet | Required for searching records |

### Installation / इंस्टॉलेशन

1. **Download the APK** from the official government portal or Play Store
2. **Enable Unknown Sources** (if installing from APK):
   - Go to Settings → Security
   - Enable "Unknown Sources" or "Install from Unknown Apps"
3. **Install the App** by tapping on the downloaded APK file
4. **Open the App** after installation completes

---

## App Features

### Home Screen / होम स्क्रीन

The home screen displays 8 service modules:

| Module | Description | Status |
|--------|-------------|--------|
| **सर्वेक्षण स्थिति 2023** | Survey Status 2023 - Search land records | ✅ Active |
| भू-नक्शा | Land Maps | 🔜 Coming Soon |
| जमाबंदी पंजी | Jamabandi Register | 🔜 Coming Soon |
| ऑनलाइन दाखिल खारिज | Online Mutation | 🔜 Coming Soon |
| भू-लगान | Land Revenue | 🔜 Coming Soon |
| परिमार्जन | Correction | 🔜 Coming Soon |
| LPC आवेदन | LPC Application | 🔜 Coming Soon |
| शिकायत | Complaint | 🔜 Coming Soon |

> **Note:** Currently, only "Survey Status 2023" (सर्वेक्षण स्थिति 2023) module is functional in the MVP version.

---

## How to Search

### Search Screen / खोज स्क्रीन

The app provides three ways to search for land records:

### 1. Search by Mobile Number / मोबाइल नंबर से खोजें

**Steps:**
1. Open the app and tap on "सर्वेक्षण स्थिति 2023"
2. Enter your **10-digit mobile number** in the first search box
3. Tap the **"Search / खोजें"** button
4. View all properties linked to this mobile number

**Example:** `9876543210`

### 2. Search by Aadhaar Number / आधार नंबर से खोजें

**Steps:**
1. Open the app and tap on "सर्वेक्षण स्थिति 2023"
2. Enter your **12-digit Aadhaar number** in the second search box
3. Tap the **"Search / खोजें"** button
4. View all properties linked to this Aadhaar number

**Example:** `123456789012`

> **Privacy Note:** Your Aadhaar number is transmitted securely and displayed in masked format (XXXX-XXXX-1234) in the results.

### 3. Search by Property ID / प्रॉपर्टी आईडी से खोजें

**Steps:**
1. Open the app and tap on "सर्वेक्षण स्थिति 2023"
2. Enter the **Property Unique ID** in the third search box
3. Tap the **"Search / खोजें"** button
4. View the specific property details

**Property ID Format:** `BH2023-XXX-NNNNN`
- `BH` = Bihar
- `2023` = Survey Year
- `XXX` = District Code (PAT=Patna, MUZ=Muzaffarpur, GAY=Gaya, BHG=Bhagalpur)
- `NNNNN` = Serial Number

**Example:** `BH2023-PAT-00001`

---

## Viewing Property Details

### Properties List / संपत्तियों की सूची

After a successful search, you will see:

1. **Owner Information Card** (मालिक की जानकारी):
   - Name / नाम
   - Father's/Husband's Name / पिता/पति का नाम
   - Phone Number / फोन नंबर
   - Masked Aadhaar / आधार नंबर (मास्क्ड)

2. **Property Cards** (संपत्ति कार्ड):
   - Property Unique ID
   - Plot Number / प्लॉट नंबर
   - Khata Number / खाता नंबर
   - Village / गाँव
   - Area / क्षेत्रफल
   - Document Count / दस्तावेज़ संख्या

**Tap on any property card to view complete details.**

### Property Detail Screen / संपत्ति विवरण स्क्रीन

The detail screen shows:

#### Owner Details / मालिक विवरण
- Full Name / पूरा नाम
- Father's/Husband's Name / पिता/पति का नाम
- Gender / लिंग
- Phone Number / फोन नंबर
- Aadhaar (Masked) / आधार नंबर

#### Land Details / भूमि विवरण
- Plot Number / प्लॉट नंबर
- Khata Number / खाता नंबर
- Area in Acres / एकड़ में क्षेत्रफल
- Area in Decimals / डिसमिल में क्षेत्रफल
- District / जिला
- Village / गाँव

#### Boundaries / चौहदी
- North / उत्तर
- South / दक्षिण
- East / पूर्व
- West / पश्चिम

#### Documents / दस्तावेज़
- Thumbnail grid of all attached documents
- Tap any document to view full screen

---

## Document Viewing

### Document Types / दस्तावेज़ के प्रकार

The app supports viewing of:
- **PDF Documents** - Land records, sale deeds, etc.
- **Images** - Scanned documents, photographs (JPG, PNG)

### Viewing Documents / दस्तावेज़ देखना

1. **From Property Details:**
   - Scroll to the "Documents" section
   - Tap on any document thumbnail

2. **Document Viewer Features:**
   - **Pinch to Zoom** - Zoom in/out on images
   - **Swipe** - Navigate between multiple documents
   - **Download** - Tap the download icon to save the document
   - **Open PDF** - PDF files open in external viewer

### Downloading Documents / दस्तावेज़ डाउनलोड करना

1. Open any document in the viewer
2. Tap the **Download** icon (↓) in the top right
3. The document will be saved to your device's Downloads folder

---

## Troubleshooting

### Common Issues / सामान्य समस्याएं

#### 1. "No Internet Connection" / "इंटरनेट कनेक्शन नहीं है"
**Solution:**
- Check your mobile data or WiFi connection
- Try switching between data and WiFi
- Restart the app

#### 2. "No Records Found" / "कोई रिकॉर्ड नहीं मिला"
**Possible Causes:**
- Incorrect mobile/Aadhaar/Property ID entered
- The number is not registered in the system
- Data entry errors in the database

**Solution:**
- Verify the number you entered
- Contact your local tehsil office for verification

#### 3. "Connection Timeout" / "कनेक्शन टाइमआउट"
**Solution:**
- Check your internet speed
- Try again after a few minutes
- The server might be experiencing high traffic

#### 4. Documents Not Loading
**Solution:**
- Check your internet connection
- Wait for the document to download completely
- Try tapping on a different document first

#### 5. App Crashes
**Solution:**
- Restart the app
- Clear app cache (Settings → Apps → Bihar Bhumi → Clear Cache)
- Reinstall the app if the problem persists

---

## FAQ

### Frequently Asked Questions / अक्सर पूछे जाने वाले प्रश्न

**Q1: Is this app free? / क्या यह ऐप मुफ्त है?**
> Yes, this app is completely free to use. / हाँ, यह ऐप पूरी तरह से मुफ्त है।

**Q2: Do I need to register to use the app? / क्या ऐप का उपयोग करने के लिए मुझे रजिस्टर करना होगा?**
> No registration is required. Simply search using your mobile number, Aadhaar, or Property ID.
> कोई पंजीकरण आवश्यक नहीं है। बस अपने मोबाइल नंबर, आधार, या प्रॉपर्टी आईडी का उपयोग करके खोजें।

**Q3: Is my Aadhaar number safe? / क्या मेरा आधार नंबर सुरक्षित है?**
> Yes, your Aadhaar number is transmitted securely over HTTPS and is displayed in masked format in the app.
> हाँ, आपका आधार नंबर HTTPS पर सुरक्षित रूप से प्रेषित होता है और ऐप में मास्क्ड प्रारूप में प्रदर्शित होता है।

**Q4: Can I edit my property details through this app? / क्या मैं इस ऐप के माध्यम से अपने संपत्ति विवरण संपादित कर सकता हूं?**
> No, this app is for viewing only. For corrections, please visit your local tehsil office or use the "Correction" module (coming soon).
> नहीं, यह ऐप केवल देखने के लिए है। सुधार के लिए, कृपया अपने स्थानीय तहसील कार्यालय जाएं।

**Q5: What should I do if my property is not showing? / अगर मेरी संपत्ति नहीं दिख रही है तो मुझे क्या करना चाहिए?**
> Please contact your local tehsil office with your land documents. They will verify and update the records.
> कृपया अपने भूमि दस्तावेजों के साथ अपने स्थानीय तहसील कार्यालय से संपर्क करें।

**Q6: Which districts are covered? / कौन से जिले शामिल हैं?**
> Currently available: Patna, Muzaffarpur, Gaya, Bhagalpur. More districts will be added soon.
> वर्तमान में उपलब्ध: पटना, मुजफ्फरपुर, गया, भागलपुर। जल्द ही और जिले जोड़े जाएंगे।

**Q7: Can I use this app offline? / क्या मैं इस ऐप को ऑफलाइन उपयोग कर सकता हूं?**
> No, an internet connection is required to search and view records.
> नहीं, रिकॉर्ड खोजने और देखने के लिए इंटरनेट कनेक्शन आवश्यक है।

---

## Contact & Support

For technical support or queries:

- **Department:** Revenue and Land Reforms, Government of Bihar
- **Website:** [Official Website URL]
- **Helpline:** [Helpline Number]
- **Email:** [Support Email]

---

## Version Information

| Version | Release Date | Changes |
|---------|--------------|---------|
| 1.0.0 | 2023 | Initial release with Survey Status 2023 module |

---

*This document is part of the Bihar Land Survey Mobile Application project.*
*Developed for Department of Revenue and Land Reforms, Government of Bihar.*
*Powered by NIC (National Informatics Centre)*
