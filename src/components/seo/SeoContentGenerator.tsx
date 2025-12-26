"use client"

import { useMemo } from "react"
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, Lightbulb, CheckCircle, List } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaqItem } from "@/components/ui/faq-item"
import { useSettings } from "@/components/providers/SettingsProvider"

interface SeoContentProps {
  title: string
  description: string
  categoryName?: string
}

export function SeoContentGenerator({ title, description, categoryName = "General" }: SeoContentProps) {
  const { language } = useSettings()

  const copy = useMemo(() => {
    const categoryHintEn = categoryName.toLowerCase()

    switch (language) {
      case 'hi':
        return {
          whatIsTitle: `${title} क्या है?`,
          intro1:
            `${title} एक ऑनलाइन टूल है जो आपको ${categoryName} से जुड़ी गणनाएँ जल्दी और सही तरीके से करने में मदद करता है। ` +
            `${description} चाहे आप नौकरीपेशा हों, छात्र हों, या बस तुरंत जवाब चाहते हों—यह कैलकुलेटर आपको तुरंत सटीक परिणाम देता है ताकि आप सही निर्णय ले सकें।`,
          intro2:
            `हमारा ${title} आसान इंटरफ़ेस और तेज़ प्रोसेसिंग के लिए बनाया गया है। जटिल फ़ॉर्मूले बैकग्राउंड में हैं—आप सिर्फ़ वैल्यू डालें और परिणाम देखें। यह पूरी तरह मुफ़्त है और मोबाइल/टैबलेट/डेस्कटॉप सभी पर काम करता है।`,

          howToTitle: `${title} कैसे इस्तेमाल करें`,
          howToIntro:
            `${title} इस्तेमाल करना बहुत आसान है—किसी तकनीकी ज्ञान की ज़रूरत नहीं। परिणाम पाने के लिए ये स्टेप्स फॉलो करें:`,
          steps: [
            'इनपुट फ़ील्ड में आवश्यक वैल्यू भरें।',
            'यदि यूनिट/फ़ॉर्मेट दिख रहा हो तो सही यूनिट चुनें।',
            `“गणना करें” बटन पर क्लिक करें।`,
            'तुरंत डिटेल्ड परिणाम और विश्लेषण देखें।',
            'नया कैलकुलेशन करने के लिए “रीसेट करें” करें।',
            'ज़रूरत हो तो रिपोर्ट डाउनलोड/शेयर/प्रिंट करें।',
          ],

          benefitsTitle: `हमारा ${title} क्यों इस्तेमाल करें?`,
          b1Title: 'सटीक और भरोसेमंद',
          b1Body: `हमारा ${title} सटीक परिणामों के लिए स्टैंडर्ड फ़ॉर्मूले/एल्गोरिद्म का उपयोग करता है।`,
          b2Title: 'आसान इंटरफ़ेस',
          b2Body: 'सिंपल डिज़ाइन के कारण इनपुट देना और परिणाम समझना आसान है—कोई मैन्युअल नहीं चाहिए।',
          b3Title: 'पूरी तरह मुफ़्त',
          b3Body: `आप बिना किसी शुल्क के ${title} की सभी सुविधाएँ इस्तेमाल कर सकते हैं।`,
          b4Title: 'सुरक्षित और प्राइवेट',
          b4Body: 'आपके इनपुट सुरक्षित तरीके से प्रोसेस होते हैं; हम आपकी व्यक्तिगत वैल्यू स्टोर नहीं करते।',

          faqTitle: 'अक्सर पूछे जाने वाले सवाल (FAQ)',
          faq: [
            { q: `${title} क्या मुफ़्त है?`, a: `हाँ, ${title} पूरी तरह मुफ़्त है। आप जितनी बार चाहें गणना कर सकते हैं।` },
            {
              q: `${title} कितना सटीक है?`,
              a: `यह टूल स्टैंडर्ड फ़ॉर्मूले और एल्गोरिद्म पर आधारित है। महत्वपूर्ण वित्तीय/कानूनी निर्णयों के लिए विशेषज्ञ से सलाह लेना बेहतर है।`,
            },
            { q: 'क्या मैं इसे मोबाइल पर इस्तेमाल कर सकता/सकती हूँ?', a: 'हाँ। वेबसाइट मोबाइल, टैबलेट और डेस्कटॉप पर अच्छे से काम करती है।' },
            { q: `क्या ${title} इस्तेमाल करने के लिए रजिस्ट्रेशन ज़रूरी है?`, a: 'नहीं। आप बिना अकाउंट बनाए तुरंत इस्तेमाल कर सकते हैं।' },
            { q: 'मैं परिणाम कैसे शेयर करूँ?', a: 'आप URL कॉपी करके या उपलब्ध शेयर विकल्पों से परिणाम साझा कर सकते हैं।' },
          ],

          tipsTitle: 'उपयोगी टिप्स',
          tips: [
            'सबसे सही परिणाम के लिए इनपुट वैल्यू दोबारा जाँचें।',
            'कैलकुलेटर क्या मापता है, यह समझने के लिए डिस्क्रिप्शन पढ़ें।',
            'इस पेज को बुकमार्क करें (Ctrl + D) ताकि बाद में आसानी से खोल सकें।',
            `${categoryName} कैटेगरी के अन्य टूल्स भी देखें ताकि तुलना/विश्लेषण बेहतर हो।`,
          ],
        }

      case 'ta':
        return {
          whatIsTitle: `${title} என்றால் என்ன?`,
          intro1:
            `${title} என்பது ${categoryName} தொடர்பான கணக்கீடுகளை விரைவாகவும் துல்லியமாகவும் செய்ய உதவும் ஆன்லைன் கருவி. ` +
            `${description} நீங்கள் உடனடி முடிவுகளைத் தேடினாலும், திட்டமிட நினைத்தாலும்—இந்த கால்குலேட்டர் நம்பகமான முடிவுகளை உடனே வழங்குகிறது.`,
          intro2:
            `${title} எளிதான இடைமுகம் மற்றும் வேகமான செயலாக்கத்துடன் உருவாக்கப்பட்டுள்ளது. சிக்கலான சூத்திரங்கள் பின்னணியில் இயங்கும்—நீங்கள் மதிப்புகளை உள்ளிடுங்கள், முடிவுகளைப் பாருங்கள்.`,

          howToTitle: `${title} எப்படி பயன்படுத்துவது`,
          howToIntro: `இந்த ${title} பயன்படுத்த மிகவும் எளிது. முடிவுகளைப் பெற கீழே உள்ள படிகளைப் பின்பற்றுங்கள்:`,
          steps: [
            'தேவையான மதிப்புகளை உள்ளீடு பெட்டிகளில் உள்ளிடுங்கள்.',
            'அலகுகள்/வடிவம் சரியாக உள்ளதா சரிபாருங்கள் (இருந்தால்).',
            '“கணக்கிடு” பொத்தானை அழுத்துங்கள்.',
            'விவரமான முடிவுகளை உடனடியாகப் பாருங்கள்.',
            'புதிய கணக்கீட்டிற்கு “அழி/மீட்டமை” பயன்படுத்துங்கள்.',
            'தேவையெனில் பதிவிறக்கு/பகிர்/அச்சிடு.',
          ],

          benefitsTitle: `எங்கள் ${title} ஏன் பயன்படுத்த வேண்டும்?`,
          b1Title: 'துல்லியம் & நம்பகத்தன்மை',
          b1Body: `${title} நிலையான சூத்திரங்களைப் பயன்படுத்தி துல்லியமான முடிவுகளை வழங்குகிறது.`,
          b2Title: 'எளிய பயன்பாடு',
          b2Body: 'எளிய வடிவமைப்பு காரணமாக உள்ளீடு செய்வதும் முடிவுகளைப் புரிந்து கொள்வதும் சுலபம்.',
          b3Title: 'முழுமையாக இலவசம்',
          b3Body: `${title} அம்சங்களை எந்த கட்டணமும் இல்லாமல் பயன்படுத்தலாம்.`,
          b4Title: 'பாதுகாப்பு & தனியுரிமை',
          b4Body: 'உங்கள் உள்ளீடுகளை நாம் சேமிக்கவில்லை; பாதுகாப்பாக செயலாக்கப்படுகிறது.',

          faqTitle: 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQ)',
          faq: [
            { q: `${title} இலவசமா?`, a: `ஆம், ${title} முழுமையாக இலவசம்.` },
            { q: `${title} முடிவுகள் எவ்வளவு துல்லியம்?`, a: 'நிலையான சூத்திரங்கள்/கணக்கீட்டு முறைகளின் அடிப்படையில் உள்ளது. முக்கிய முடிவுகளுக்கு நிபுணர் ஆலோசனை சிறந்தது.' },
            { q: 'மொபைலில் பயன்படுத்தலாமா?', a: 'ஆம். மொபைல்/டேப்லெட்/டெஸ்க்டாப்பில் நன்றாக வேலை செய்கிறது.' },
            { q: `பயன்படுத்த பதிவு செய்ய வேண்டுமா?`, a: 'இல்லை. பதிவு இல்லாமலே உடனே பயன்படுத்தலாம்.' },
            { q: 'முடிவுகளை எப்படி பகிரலாம்?', a: 'URL-ஐ நகலெடுத்து அல்லது கிடைக்கும் பகிர்வு விருப்பங்களைப் பயன்படுத்தலாம்.' },
          ],

          tipsTitle: 'பயனுள்ள குறிப்புகள்',
          tips: [
            'உள்ளீட்டு மதிப்புகளை மீண்டும் சரிபார்க்கவும்.',
            'கால்குலேட்டர் என்ன அளக்கிறது என்பதைப் புரிந்து கொள்ள விளக்கத்தைப் படிக்கவும்.',
            'இந்த பக்கத்தை புத்தகக்குறியாக சேமிக்கவும் (Ctrl + D).',
            `${categoryName} பிரிவில் உள்ள பிற கருவிகளையும் முயற்சிக்கவும்.`,
          ],
        }

      case 'te':
        return {
          whatIsTitle: `${title} అంటే ఏమిటి?`,
          intro1:
            `${title} అనేది ${categoryName} సంబంధిత లెక్కింపులను త్వరగా, ఖచ్చితంగా చేయడానికి సహాయపడే ఆన్లైన్ టూల్. ` +
            `${description} మీరు వెంటనే ఫలితాలు కోరుకున్నా లేదా ప్లాన్ చేసుకున్నా—ఈ కాలిక్యులేటర్ నమ్మకమైన ఫలితాలను వెంటనే ఇస్తుంది.`,
          intro2:
            `${title} సులభమైన ఇంటర్‌ఫేస్‌తో రూపొందించబడింది. క్లిష్టమైన ఫార్ములాలు బ్యాక్‌గ్రౌండ్‌లో పనిచేస్తాయి—మీరు విలువలు ఎంటర్ చేసి ఫలితాలు చూడండి.`,

          howToTitle: `${title} ఎలా ఉపయోగించాలి`,
          howToIntro: `${title} ఉపయోగించడం సులువు. ఫలితాల కోసం ఈ స్టెప్స్ అనుసరించండి:`,
          steps: [
            'అవసరమైన విలువలను ఇన్‌పుట్ ఫీల్డ్స్‌లో నమోదు చేయండి.',
            'యూనిట్లు/ఫార్మాట్ సరిగ్గా ఉన్నాయా చెక్ చేయండి (ఉంటే).',
            '“లెక్కించండి” బటన్‌పై క్లిక్ చేయండి.',
            'వివరమైన ఫలితాలను వెంటనే చూడండి.',
            'కొత్త లెక్కింపుకు “క్లియర్/రిసెట్” ఉపయోగించండి.',
            'అవసరమైతే డౌన్‌లోడ్/షేర్/ప్రింట్ చేయండి.',
          ],

          benefitsTitle: `మా ${title} ఎందుకు ఉపయోగించాలి?`,
          b1Title: 'ఖచ్చితత్వం & నమ్మకం',
          b1Body: `${title} ప్రామాణిక ఫార్ములాలతో ఖచ్చితమైన ఫలితాలు ఇస్తుంది.`,
          b2Title: 'సులభమైన ఇంటర్‌ఫేస్',
          b2Body: 'సింపుల్ డిజైన్ వల్ల ఇన్‌పుట్ ఇవ్వడం, ఫలితాలు అర్థం చేసుకోవడం సులువు.',
          b3Title: 'పూర్తిగా ఉచితం',
          b3Body: `${title} ఫీచర్స్‌ను ఎటువంటి ఖర్చు లేకుండా ఉపయోగించవచ్చు.`,
          b4Title: 'ప్రైవసీ & భద్రత',
          b4Body: 'మీ ఇన్‌పుట్‌లను మేము నిల్వ చేయము; సురక్షితంగా ప్రాసెస్ అవుతాయి.',

          faqTitle: 'తరచుగా అడిగే ప్రశ్నలు (FAQ)',
          faq: [
            { q: `${title} ఉచితమా?`, a: `అవును, ${title} పూర్తిగా ఉచితం.` },
            { q: `${title} ఎంత ఖచ్చితంగా ఉంటుంది?`, a: 'ప్రామాణిక ఫార్ములాలు/అల్గోరిథమ్‌లపై ఆధారితం. ముఖ్య నిర్ణయాల కోసం నిపుణుల సలహా మంచిది.' },
            { q: 'మొబైల్‌లో ఉపయోగించగలనా?', a: 'అవును. మొబైల్/టాబ్లెట్/డెస్క్‌టాప్‌లో బాగా పనిచేస్తుంది.' },
            { q: 'వాడటానికి రిజిస్ట్రేషన్ అవసరమా?', a: 'లేదు. ఖాతా లేకుండానే వెంటనే ఉపయోగించవచ్చు.' },
            { q: 'ఫలితాలను ఎలా షేర్ చేయాలి?', a: 'URL కాపీ చేసి లేదా అందుబాటులో ఉన్న షేర్ ఆప్షన్లతో పంచుకోవచ్చు.' },
          ],

          tipsTitle: 'ఉపయోగకరమైన టిప్స్',
          tips: [
            'ఇన్‌పుట్ విలువలను మరోసారి తనిఖీ చేయండి.',
            'కాలిక్యులేటర్ ఏమి కొలుస్తుందో అర్థం చేసుకోవడానికి వివరణ చదవండి.',
            'ఈ పేజీని బుక్‌మార్క్ చేయండి (Ctrl + D).',
            `${categoryName} కేటగిరీలోని ఇతర టూల్స్‌ను కూడా చూడండి.`,
          ],
        }

      case 'bn':
        return {
          whatIsTitle: `${title} কী?`,
          intro1:
            `${title} হলো ${categoryName} সম্পর্কিত হিসাব দ্রুত ও নির্ভুলভাবে করতে সহায়ক একটি অনলাইন টুল। ` +
            `${description} আপনি দ্রুত উত্তর চান বা পরিকল্পনা করতে চান—এই ক্যালকুলেটর সাথে সাথে বিশ্বাসযোগ্য ফলাফল দেয়।`,
          intro2:
            `${title} সহজ ইন্টারফেস ও দ্রুত প্রসেসিং সহ তৈরি। জটিল ফর্মুলা ব্যাকগ্রাউন্ডে কাজ করে—আপনি শুধু মান দিন এবং ফলাফল দেখুন।`,

          howToTitle: `${title} কীভাবে ব্যবহার করবেন`,
          howToIntro: `${title} ব্যবহার করা সহজ। ফলাফল পেতে এই ধাপগুলো অনুসরণ করুন:`,
          steps: [
            'ইনপুট ফিল্ডে প্রয়োজনীয় মান লিখুন।',
            'ইউনিট/ফরম্যাট সঠিক আছে কিনা যাচাই করুন (প্রযোজ্য হলে)।',
            '“ক্যালকুলেট” বোতামে ক্লিক করুন।',
            'তৎক্ষণাৎ বিস্তারিত ফলাফল দেখুন।',
            'নতুন হিসাবের জন্য “ক্লিয়ার/রিসেট” ব্যবহার করুন।',
            'প্রয়োজন হলে ডাউনলোড/শেয়ার/প্রিন্ট করুন।',
          ],

          benefitsTitle: `আমাদের ${title} কেন ব্যবহার করবেন?`,
          b1Title: 'নির্ভুলতা ও বিশ্বাসযোগ্যতা',
          b1Body: `${title} স্ট্যান্ডার্ড ফর্মুলা ব্যবহার করে নির্ভুল ফলাফল দেয়।`,
          b2Title: 'সহজ ব্যবহার',
          b2Body: 'সাধারণ ডিজাইনের কারণে ইনপুট দেওয়া ও ফলাফল বোঝা সহজ।',
          b3Title: 'সম্পূর্ণ বিনামূল্যে',
          b3Body: `${title} এর ফিচারগুলো কোনো খরচ ছাড়াই ব্যবহার করতে পারবেন।`,
          b4Title: 'গোপনীয়তা ও নিরাপত্তা',
          b4Body: 'আপনার ইনপুট আমরা সংরক্ষণ করি না; নিরাপদভাবে প্রসেস হয়।',

          faqTitle: 'প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ)',
          faq: [
            { q: `${title} কি ফ্রি?`, a: `হ্যাঁ, ${title} সম্পূর্ণ ফ্রি।` },
            { q: `${title} কতটা নির্ভুল?`, a: 'স্ট্যান্ডার্ড ফর্মুলা/অ্যালগরিদমের উপর ভিত্তি করে। গুরুত্বপূর্ণ সিদ্ধান্তে বিশেষজ্ঞের পরামর্শ নিন।' },
            { q: 'মোবাইলে ব্যবহার করা যাবে?', a: 'হ্যাঁ। মোবাইল/ট্যাবলেট/ডেস্কটপে ভালো কাজ করে।' },
            { q: 'রেজিস্ট্রেশন লাগবে?', a: 'না। অ্যাকাউন্ট ছাড়াই ব্যবহার করতে পারবেন।' },
            { q: 'ফলাফল কীভাবে শেয়ার করব?', a: 'URL কপি করে বা শেয়ার অপশন ব্যবহার করে শেয়ার করতে পারেন।' },
          ],

          tipsTitle: 'উপযোগী টিপস',
          tips: [
            'সঠিক ফলাফলের জন্য ইনপুট মানগুলো আবার যাচাই করুন।',
            'ক্যালকুলেটর কী মাপে তা জানতে বর্ণনা পড়ুন।',
            'এই পেজটি বুকমার্ক করুন (Ctrl + D)।',
            `${categoryName} ক্যাটাগরির অন্যান্য টুলও দেখে নিন।`,
          ],
        }

      case 'mr':
        return {
          whatIsTitle: `${title} म्हणजे काय?`,
          intro1:
            `${title} हे ${categoryName} संबंधित गणना जलद आणि अचूक करण्यासाठीचे ऑनलाइन टूल आहे. ` +
            `${description} तुम्हाला पटकन उत्तर हवे असो किंवा योजना करायची असो—हे कॅल्क्युलेटर त्वरित विश्वासार्ह निकाल देते.`,
          intro2:
            `${title} सोप्या इंटरफेससह तयार केले आहे. गुंतागुंतीची सूत्रे पार्श्वभूमीत चालतात—तुम्ही फक्त मूल्ये भरा आणि निकाल पहा.`,

          howToTitle: `${title} कसे वापरायचे`,
          howToIntro: `${title} वापरणे सोपे आहे. निकाल मिळवण्यासाठी हे स्टेप्स फॉलो करा:`,
          steps: [
            'इनपुट फील्डमध्ये आवश्यक मूल्ये भरा.',
            'युनिट/फॉरमॅट योग्य आहे का तपासा (लागू असल्यास).',
            '“गणना करा” बटणावर क्लिक करा.',
            'ताबडतोब सविस्तर निकाल पहा.',
            'नवीन गणनेसाठी “क्लिअर/रीसेट” वापरा.',
            'गरज असल्यास डाउनलोड/शेअर/प्रिंट करा.',
          ],

          benefitsTitle: `आमचा ${title} का वापरावा?`,
          b1Title: 'अचूकता व विश्वासार्हता',
          b1Body: `${title} स्टँडर्ड फॉर्म्युलांचा वापर करून अचूक निकाल देते.`,
          b2Title: 'सोपे वापर',
          b2Body: 'सिंपल डिझाइनमुळे डेटा भरणे व निकाल समजणे सोपे आहे.',
          b3Title: 'पूर्णपणे मोफत',
          b3Body: `${title} ची वैशिष्ट्ये कोणत्याही शुल्काशिवाय वापरू शकता.`,
          b4Title: 'प्रायव्हसी व सुरक्षा',
          b4Body: 'तुमचे इनपुट आम्ही साठवत नाही; सुरक्षितपणे प्रोसेस होते.',

          faqTitle: 'नेहमी विचारले जाणारे प्रश्न (FAQ)',
          faq: [
            { q: `${title} मोफत आहे का?`, a: `होय, ${title} पूर्णपणे मोफत आहे.` },
            { q: `${title} किती अचूक आहे?`, a: 'स्टँडर्ड फॉर्म्युले/अल्गोरिदमवर आधारित. महत्त्वाच्या निर्णयांसाठी तज्ज्ञांचा सल्ला घ्या.' },
            { q: 'मोबाईलवर वापरू शकतो का?', a: 'होय. मोबाईल/टॅबलेट/डेस्कटॉपवर चांगले काम करते.' },
            { q: 'रजिस्ट्रेशन आवश्यक आहे का?', a: 'नाही. अकाउंटशिवायही वापरू शकता.' },
            { q: 'निकाल कसा शेअर करायचा?', a: 'URL कॉपी करून किंवा उपलब्ध शेअर पर्यायांचा वापर करून शेअर करू शकता.' },
          ],

          tipsTitle: 'उपयुक्त टिप्स',
          tips: [
            'इनपुट मूल्ये पुन्हा तपासा.',
            'कॅल्क्युलेटर काय मोजतो ते समजण्यासाठी वर्णन वाचा.',
            'ही पेज बुकमार्क करा (Ctrl + D).',
            `${categoryName} कॅटेगरीतील इतर टूल्सही पाहा.`,
          ],
        }

      case 'gu':
        return {
          whatIsTitle: `${title} શું છે?`,
          intro1:
            `${title} એ ${categoryName} સંબંધિત ગણતરીઓ ઝડપથી અને ચોક્કસ રીતે કરવામાં મદદરૂપ એક ઓનલાઇન ટૂલ છે. ` +
            `${description} તમે તરત જવાબ શોધતા હો અથવા આયોજન કરવા માંગતા હો—આ કેલ્ક્યુલેટર તરત વિશ્વસનીય પરિણામ આપે છે.`,
          intro2:
            `${title} સરળ ઇન્ટરફેસ અને ઝડપી પ્રોસેસિંગ સાથે બનાવ્યું છે. જટિલ સૂત્રો પાછળથી ચાલે છે—તમે ફક્ત મૂલ્યો દાખલ કરો અને પરિણામ જુઓ.`,

          howToTitle: `${title} કેવી રીતે વાપરવું`,
          howToIntro: `${title} વાપરવું સરળ છે. પરિણામ માટે આ પગલાં અનુસરો:`,
          steps: [
            'ઇનપુટ ફિલ્ડમાં જરૂરી મૂલ્યો દાખલ કરો.',
            'યૂનિટ/ફોર્મેટ સાચું છે કે નહીં ચકાસો (લાગુ પડે તો).',
            '“ગણતરી કરો” બટન પર ક્લિક કરો.',
            'તુરંત વિગતવાર પરિણામ જુઓ.',
            'નવી ગણતરી માટે “ક્લિયર/રીસેટ” વાપરો.',
            'જરૂર હોય તો ડાઉનલોડ/શેર/પ્રિન્ટ કરો.',
          ],

          benefitsTitle: `અમારું ${title} કેમ વાપરવું?`,
          b1Title: 'ચોકસાઈ અને વિશ્વસનીયતા',
          b1Body: `${title} સ્ટાન્ડર્ડ સૂત્રો વડે ચોક્કસ પરિણામ આપે છે.`,
          b2Title: 'સહેલુ ઇન્ટરફેસ',
          b2Body: 'સાદું ડિઝાઇન હોવાથી ઇનપુટ આપવું અને પરિણામ સમજવું સરળ છે.',
          b3Title: 'સંપૂર્ણ મફત',
          b3Body: `${title} ની બધી સુવિધાઓ કોઈ ખર્ચ વગર વાપરી શકો છો.`,
          b4Title: 'પ્રાઇવસી અને સુરક્ષા',
          b4Body: 'અમે તમારા ઇનપુટ્સ સંગ્રહતા નથી; સુરક્ષિત રીતે પ્રોસેસ થાય છે.',

          faqTitle: 'વારંવાર પૂછાતા પ્રશ્નો (FAQ)',
          faq: [
            { q: `${title} મફત છે?`, a: `હા, ${title} સંપૂર્ણ મફત છે.` },
            { q: `${title} કેટલું ચોક્કસ છે?`, a: 'સ્ટાન્ડર્ડ સૂત્રો/અલ્ગોરિધમ પર આધારિત છે. મહત્વના નિર્ણય માટે નિષ્ણાતની સલાહ લો.' },
            { q: 'શું મોબાઇલ પર વાપરી શકું?', a: 'હા. મોબાઇલ/ટેબલેટ/ડેસ્કટોપ પર સારી રીતે કામ કરે છે.' },
            { q: 'રજિસ્ટ્રેશન જરૂરી છે?', a: 'ના. અકાઉન્ટ વગર તરત વાપરી શકો છો.' },
            { q: 'પરિણામ કેવી રીતે શેર કરું?', a: 'URL કૉપી કરીને અથવા ઉપલબ્ધ શેર વિકલ્પોથી શેર કરી શકો છો.' },
          ],

          tipsTitle: 'ઉપયોગી ટીપ્સ',
          tips: [
            'ઇનપુટ મૂલ્યો ફરી તપાસો.',
            'કેલ્ક્યુલેટર શું માપે છે તે સમજવા વર્ણન વાંચો.',
            'આ પેજ બુકમાર્ક કરો (Ctrl + D).',
            `${categoryName} કેટેગરીના અન્ય ટૂલ્સ પણ જુઓ.`,
          ],
        }

      case 'en':
      default:
        return {
          whatIsTitle: `What is the ${title}?`,
          intro1:
            `The ${title} is a powerful online tool designed to help you with ${categoryHintEn} calculations. ` +
            `${description} Whether you are a professional, a student, or just someone looking to get quick answers, ` +
            `this calculator provides accurate results instantly. In today's fast-paced world, having access to reliable ` +
            `tools like the ${title} can save you time and effort, ensuring that you make informed decisions based on precise data.`,
          intro2:
            `Our ${title} is built with user experience in mind, offering a clean interface and instant processing. ` +
            `It handles complex formulas behind the scenes so you don't have to. Simply enter your values, and let the ` +
            `tool do the rest. It's completely free to use and accessible from any device, making it the perfect companion ` +
            `for your ${categoryHintEn} needs.`,

          howToTitle: `How to Use the ${title}`,
          howToIntro:
            `Using the ${title} is straightforward and requires no technical expertise. Follow these simple steps to get your results:`,
          steps: [
            'Enter the required values in the input fields.',
            'Check the units to ensure accuracy (if applicable).',
            "Click the 'Calculate' button to process the data.",
            'View your detailed results and analysis instantly.',
            "Use the 'Clear' button to start a new calculation.",
            'Share or save your results for future reference.',
          ],

          benefitsTitle: `Why Use Our ${title}?`,
          b1Title: 'Accuracy & Reliability',
          b1Body:
            `Our ${title} uses advanced algorithms to ensure that every result is precise. We regularly update our formulas to reflect the latest standards in ${categoryName}.`,
          b2Title: 'User-Friendly Interface',
          b2Body:
            'Designed for simplicity, our tool allows you to input data easily and understand the results without confusion. No complex manuals needed.',
          b3Title: 'Completely Free',
          b3Body:
            `Access all features of the ${title} without any cost. We believe in providing valuable tools to everyone, free of charge.`,
          b4Title: 'Secure & Private',
          b4Body:
            'Your data is processed securely. We do not store your personal inputs, ensuring your privacy is always protected while using our tools.',

          faqTitle: 'Frequently Asked Questions (FAQ)',
          faq: [
            {
              q: `Is the ${title} free to use?`,
              a: `Yes, the ${title} is completely free to use. You can perform as many calculations as you need without any hidden charges or subscription fees.`,
            },
            {
              q: `How accurate is the ${title}?`,
              a: `Our ${title} is highly accurate and uses standard formulas and algorithms. However, for critical professional or medical decisions, we always recommend consulting with a qualified expert.`,
            },
            {
              q: 'Can I use this tool on my mobile phone?',
              a: 'Absolutely! Our website is fully responsive, meaning it works perfectly on smartphones, tablets, and desktop computers.',
            },
            {
              q: `Do I need to register to use the ${title}?`,
              a: 'No registration is required. You can start using the tool immediately without creating an account or providing any personal information.',
            },
            {
              q: 'How can I share my results?',
              a: 'You can easily share your results by copying the URL or using the share buttons provided on the results page (if available).',
            },
          ],

          tipsTitle: 'Helpful Tips',
          tips: [
            'Double-check your input values to ensure the most accurate results.',
            'Read the description carefully to understand what the calculator specifically measures.',
            'Bookmark this page (Ctrl+D) so you can easily access it whenever you need it.',
            `Explore our related tools in the ${categoryName} category for more comprehensive analysis.`,
          ],
        }
    }
  }, [language, title, description, categoryName])

  return (
    <div className="mt-12 space-y-8 text-left">
      {/* Introduction Section */}
      <section className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
          {copy.whatIsTitle}
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          {copy.intro1}
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          {copy.intro2}
        </p>
      </section>

      {/* How to Use Section */}
      <section className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <List className="w-6 h-6 text-primary" />
          {copy.howToTitle}
        </h2>
        <p className="text-muted-foreground mb-4">
          {copy.howToIntro}
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {copy.steps.map((step, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground">{step}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
          <CheckCircle className="w-6 h-6 text-primary" />
          {copy.benefitsTitle}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{copy.b1Title}</h3>
            <p className="text-muted-foreground">
              {copy.b1Body}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{copy.b2Title}</h3>
            <p className="text-muted-foreground">
              {copy.b2Body}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{copy.b3Title}</h3>
            <p className="text-muted-foreground">
              {copy.b3Body}
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{copy.b4Title}</h3>
            <p className="text-muted-foreground">
              {copy.b4Body}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="prose dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold flex items-center gap-2 mb-6">
          <HelpCircle className="w-6 h-6 text-primary" />
          {copy.faqTitle}
        </h2>
        <div className="space-y-4">
          {copy.faq.map((item, idx) => (
            <FaqItem
              key={idx}
              question={item.q}
              answer={item.a}
            />
          ))}
        </div>
      </section>

      {/* Tips Section */}
      <section className="bg-primary/5 rounded-xl p-6 border border-primary/10">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 text-primary">
          <Lightbulb className="w-5 h-5" />
          {copy.tipsTitle}
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          {copy.tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
