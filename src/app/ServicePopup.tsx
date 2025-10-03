// components/ServicePopup.tsx
'use client';

import { useEffect, useState } from 'react';

interface ServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
}

const ServicePopup = ({ isOpen, onClose, serviceName }: ServicePopupProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  // Function to redirect to WhatsApp
  const redirectToWhatsApp = () => {
    const phoneNumber = "+21624262849"; // Your WhatsApp number
    const message = `مرحبا، أنا مهتم بخدمة ${serviceName} وأرغب في الحصول على مزيد من المعلومات.`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen && !isVisible) return null;

  const getServiceMessage = (service: string) => {
    const messages: { [key: string]: string } = {
      'اكتشاف المواهب': 'نقدم خدمة اكتشاف المواهب من خلال فريق من الخبراء والمختصين في تقييم القدرات الكروية. نحن نكتشف المواهب الواعدة ونعمل على تطويرها لتصل إلى أعلى المستويات.',
      'إدارة المسيرة الرياضية': 'نساعد اللاعبين في إدارة مسيرتهم الرياضية بشكل احترافي، من التخطيط للتدريبات إلى اختيار الفرص المناسبة للتطور والنمو.',
      'التعاقد مع الأندية': 'نوفر وساطة احترافية بين اللاعبين والأندية، ونساعد في التفاوض على العقود لضمان حصول اللاعب على أفضل الشروط.',
      'تسويق اللاعبين': 'نعمل على تسويق اللاعبين بشكل احترافي من خلال وسائل الإعلام ووسائل التواصل الاجتماعي لزيادة شهرتهم وقيمتهم السوقية.',
      'دورات و بطولات': 'ننظم دورات تدريبية وبطولات متنوعة لتطوير مهارات اللاعبين وتوفير منصة للتنافس واكتساب الخبرة.',
      'خدمة إنشاء CV': 'نساعد اللاعبين في إنشاء سيرة ذاتية احترافية تعرض إنجازاتهم ومهاراتهم بشكل مميز يجذب انتباه الأندية والوكلاء.',
      'الاستشارات الرياضية': 'نقدم استشارات متخصصة في المجال الرياضي تشمل الجوانب الفنية، الإدارية، والقانونية لمساعدة اللاعبين في اتخاذ القرارات الصحيحة.'
    };

    return messages[service] || `نحن نقدم خدمة ${service} بأعلى معايير الجودة والاحترافية.`;
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-0'
    }`}>
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-auto transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">{serviceName}</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">
              {getServiceMessage(serviceName)}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm font-medium">
              📞 للاستفسار عن هذه الخدمة، لا تتردد في الاتصال بنا
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
            >
              إغلاق
            </button>
            <button
              onClick={redirectToWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 text-center font-medium flex items-center justify-center"
            >
              <i className="fab fa-whatsapp ml-2 text-lg"></i>
              اتصل بنا على واتساب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePopup;