# Meta App Review - pages_show_list Permission

## App Information
**App Name:** Tan & Co CRM  
**Permission Requested:** pages_show_list  
**Use Case:** Social Media Posting for Salon Business

---

## Feature Description

Our CRM application allows salon staff to post before/after client photos to Instagram and Facebook Business Pages directly from within the system.

### Demo Flow:

**Step 1: Select Page**
- Staff opens the social media posting feature
- System displays dropdown list of Instagram/Facebook Business Pages the user manages
- Staff selects target page (e.g., "Tan & Co - מאין אייר" Instagram page)

**Step 2: Upload Images**
- Staff uploads client photos (before/after treatment)
- Example: Eyebrows shaping (before) and Browlift treatment (after)
- System shows preview of both images

**Step 3: Add Caption**
- Staff writes caption in Hebrew describing the treatment
- Example: "Tan & Co 🌟 #BeautyResults #TanAndCo 🌸 Browlift הופכת להדגשה של Browlift"

**Step 4: Publish**
- Staff clicks "Publish Now" (פרסם עכשיו) button
- System posts to selected Business Page using Meta API
- Success confirmation displayed: "פורסם בהצלחה!" (Published Successfully!)

---

## Permission Usage

We use **pages_show_list** permission to:

1. **Display Business Pages List**
   - Show dropdown of Instagram/Facebook Business Pages the authenticated user manages
   - Allow staff to select the target page for posting

2. **Enable Page Selection**
   - Let staff choose which Business Page to post to
   - Support multiple salon locations with different pages

3. **Post on Behalf of Business**
   - Publish content to the selected Business Page
   - Share client results automatically from CRM system

---

## Business Value

This feature helps salon owners:
- Share client transformation results on social media
- Automate posting workflow from within CRM
- Maintain consistent social media presence
- Showcase their work to attract new clients

---

## Technical Implementation

- Authentication: OAuth with Meta Business Login
- API Endpoints: Facebook Graph API for page posting
- Security: Token-based authentication with proper scope permissions
- User Experience: Hebrew RTL interface optimized for touch screens

---

## Screenshots Included

1. **Start Screen** - Demo introduction with step-by-step flow
2. **Page Selection** - Instagram Business Page dropdown
3. **Image Upload** - Before/after client photos selection
4. **Preview** - Post preview with images and caption
5. **Success** - Confirmation message after successful posting

---

## Contact Information

For any questions about this submission, please contact the app developer through the Meta Developer Dashboard.

---

**Submission Date:** October 14, 2025  
**App Status:** Development/Testing  
**Requested Permission:** pages_show_list
