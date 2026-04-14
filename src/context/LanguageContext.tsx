import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home',
    feed: 'Feed',
    report: 'Report',
    getStarted: 'Get Started',
    heroTitle: "I'm civic",
    heroSubtitle: 'REPORTER',
    letsReport: "Let's Report",
    allYour: 'ALL YOUR',
    civicNeeds: 'civic needs',
    reportTitle1: 'ALL',
    reportTitle2: 'YOUR report',
    fileAReport: 'File a Report',
    recentReports: 'Recent Reports',
    viewFeed: 'View Feed',
    guidelines: 'Guidelines',
    beSpecific: 'Be Specific',
    beSpecificDesc: 'Clearly describe the issue and its exact location.',
    provideEvidence: 'Provide Evidence',
    provideEvidenceDesc: 'Upload clear photos or videos of the problem.',
    stayUpdated: 'Stay Updated',
    stayUpdatedDesc: "Follow your report's progress in the community feed.",
    issueTitle: 'Issue Title',
    category: 'Category',
    location: 'Location',
    description: 'Description',
    evidence: 'Evidence (Photo/Video)',
    submitReport: 'Submit Report',
    success: 'SUCCESS',
    dhanyabaad: 'Dhanyabaad! 🙏',
    successDesc: 'Your report has been successfully recorded and forwarded to the relevant authorities for immediate action.',
    share: 'Share',
    referenceId: 'Reference ID',
    garbage: 'Garbage / Waste',
    road: 'Road Damage',
    water: 'Water Supply',
    electricity: 'Electricity',
    titlePlaceholder: 'e.g., Large pothole on main road',
    locationPlaceholder: 'e.g., Koteshwor, Kathmandu',
    descPlaceholder: 'Provide more details about the issue...',
    changeFile: 'Change File',
    uploadMedia: 'Upload Media',
    dragDrop: 'Drag and drop or click to browse',
    privacy: 'Privacy',
    terms: 'Terms',
    contact: 'Contact',
    builtForNepal: 'Built for a better Nepal.',
    allTypesDesc: 'All types of reports in one place with the assurance of highest accountability.',
    garbagePill: 'Garbage Collection',
    roadPill: 'Road Repair',
    waterPill: 'Water Supply',
    electricityPill: 'Electricity',
    safetyPill: 'Public Safety',
    infraPill: 'Infrastructure',
    envPill: 'Environment',
    rightsPill: 'Civic Rights',
    govPill: 'Local Governance',
    sanitationPill: 'Sanitation',
    publicFeed: 'Public Feed',
    feedDesc: 'Real-time reports from citizens across Nepal.',
    allCategories: 'All Categories',
    noReports: 'No reports found in this category.',
    loadingReports: 'Loading reports...',
  },
  ne: {
    home: 'गृहपृष्ठ',
    feed: 'फिड',
    report: 'रिपोर्ट',
    getStarted: 'सुरु गर्नुहोस्',
    heroTitle: 'म नागरिक',
    heroSubtitle: 'रिपोर्टर',
    letsReport: 'रिपोर्ट',
    allYour: 'तपाईंका सबै',
    civicNeeds: 'नागरिक आवश्यकताहरू',
    reportTitle1: 'तपाईंका',
    reportTitle2: 'सबै रिपोर्ट',
    fileAReport: 'रिपोर्ट दर्ता गर्नुहोस्',
    recentReports: 'हालैका रिपोर्टहरू',
    viewFeed: 'फिड हेर्नुहोस्',
    guidelines: 'निर्देशिकाहरू',
    beSpecific: 'विशिष्ट हुनुहोस्',
    beSpecificDesc: 'मुद्दा र यसको सही स्थान स्पष्ट रूपमा वर्णन गर्नुहोस्।',
    provideEvidence: 'प्रमाण दिनुहोस्',
    provideEvidenceDesc: 'समस्याको स्पष्ट फोटो वा भिडियोहरू अपलोड गर्नुहोस्।',
    stayUpdated: 'अपडेट रहनुहोस्',
    stayUpdatedDesc: 'सामुदायिक फिडमा आफ्नो रिपोर्टको प्रगति पछ्याउनुहोस्।',
    issueTitle: 'मुद्दाको शीर्षक',
    category: 'वर्ग',
    location: 'स्थान',
    description: 'विवरण',
    evidence: 'प्रमाण (फोटो/भिडियो)',
    submitReport: 'रिपोर्ट बुझाउनुहोस्',
    success: 'सफल',
    dhanyabaad: 'धन्यवाद! 🙏',
    successDesc: 'तपाईंको रिपोर्ट सफलतापूर्वक रेकर्ड गरिएको छ र तत्काल कारबाहीका लागि सम्बन्धित निकायमा पठाइएको छ।',
    share: 'साझा गर्नुहोस्',
    referenceId: 'सन्दर्भ आईडी',
    garbage: 'फोहोर / मैला',
    road: 'सडक क्षति',
    water: 'खानेपानी आपूर्ति',
    electricity: 'विद्युत',
    titlePlaceholder: 'जस्तै: मुख्य सडकमा ठूलो खाल्डो',
    locationPlaceholder: 'जस्तै: कोटेश्वर, काठमाडौं',
    descPlaceholder: 'मुद्दाको बारेमा थप विवरण दिनुहोस्...',
    changeFile: 'फाइल परिवर्तन गर्नुहोस्',
    uploadMedia: 'मिडिया अपलोड गर्नुहोस्',
    dragDrop: 'तान्नुहोस् र छोड्नुहोस् वा ब्राउज गर्न क्लिक गर्नुहोस्',
    privacy: 'गोपनीयता',
    terms: 'सर्तहरू',
    contact: 'सम्पर्क',
    builtForNepal: 'राम्रो नेपालको लागि निर्माण गरिएको।',
    allTypesDesc: 'उच्च जवाफदेहिताको आश्वासनका साथ सबै प्रकारका रिपोर्टहरू एकै ठाउँमा।',
    garbagePill: 'फोहोर संकलन',
    roadPill: 'सडक मर्मत',
    waterPill: 'खानेपानी',
    electricityPill: 'विद्युत',
    safetyPill: 'जनसुरक्षा',
    infraPill: 'पूर्वाधार',
    envPill: 'वातावरण',
    rightsPill: 'नागरिक अधिकार',
    govPill: 'स्थानीय शासन',
    sanitationPill: 'सरसफाई',
    publicFeed: 'सार्वजनिक फिड',
    feedDesc: 'नेपालभरका नागरिकहरूबाट वास्तविक समयका रिपोर्टहरू।',
    allCategories: 'सबै वर्गहरू',
    noReports: 'यस वर्गमा कुनै रिपोर्ट फेला परेन।',
    loadingReports: 'रिपोर्टहरू लोड हुँदैछ...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
