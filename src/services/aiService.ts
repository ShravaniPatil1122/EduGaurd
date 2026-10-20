/**
 * EduGuard AI Service Interface & Local Knowledge Engine
 * 
 * Provides educational concept simplification, parent message drafting in multiple languages,
 * catch-up plan generation, and academic risk recommendations.
 */

export interface ExplanationOptions {
  subject: string;
  topic: string;
  level: 'simple' | 'standard' | 'advanced';
}

export interface ParentMessageOptions {
  studentName: string;
  parentName: string;
  missedClassesCount: number;
  missedSubjects: string[];
  messageType: 'Missed class alert' | 'Progress update' | 'Meeting request' | 'Appreciation' | 'Fee reminder' | 'Attendance alert';
  tone: 'Friendly' | 'Formal' | 'Urgent';
  language: 'en' | 'hi' | 'mr';
  includeCatchupLink?: boolean;
}

export const aiService = {
  /**
   * Explain an educational concept with pedagogical clarity
   */
  async explainConcept(options: ExplanationOptions): Promise<{
    title: string;
    summary: string;
    keyPoints: string[];
    realWorldAnalogy: string;
    formula?: string;
  }> {
    // Simulated realistic delay for AI processing
    await new Promise((resolve) => setTimeout(resolve, 400));

    const topicNormalized = options.topic.toLowerCase();

    if (topicNormalized.includes('quadratic') || topicNormalized.includes('equation')) {
      if (options.level === 'simple') {
        return {
          title: 'Quadratic Equation - Made Super Simple',
          summary: 'Think of throwing a basketball into a hoop: the path it creates is a curve called a parabola. That curve is described by a quadratic equation!',
          keyPoints: [
            'It always has an "x squared" (x²) term as the highest power.',
            'Standard form: ax² + bx + c = 0, where "a" cannot be 0.',
            'It has 2 answers (called roots or solutions) which tell where the curve hits the ground.',
            'Easy trick: Factorize into two brackets like (x + 1)(x + 2) = 0.',
          ],
          realWorldAnalogy: 'Like finding the landing points of a ball thrown in the air: where height = 0.',
          formula: 'ax² + bx + c = 0   ➔   x = [-b ± √(b² - 4ac)] / 2a',
        };
      }
      return {
        title: 'Quadratic Equations - Second Degree Polynomials',
        summary: 'A quadratic equation is a second-order polynomial equation in a single variable x with a non-zero coefficient for x².',
        keyPoints: [
          'Can be solved by factorisation, completing the square, or using the quadratic formula.',
          'The discriminant D = b² - 4ac dictates root nature: D > 0 (two real roots), D = 0 (two equal roots), D < 0 (complex conjugate roots).',
          'Sum of roots = -b/a, Product of roots = c/a.',
        ],
        realWorldAnalogy: 'Optimizing profit curves, projectile trajectories, and satellite dish focal points.',
        formula: 'D = b² - 4ac  |  x = (-b ± √D) / (2a)',
      };
    }

    if (topicNormalized.includes('reaction') || topicNormalized.includes('chemical')) {
      return {
        title: 'Chemical Reactions & Equations - Step-by-Step',
        summary: 'A chemical reaction is a process where substances (reactants) transform into new substances (products) by rearranging atomic bonds.',
        keyPoints: [
          'Law of Conservation of Mass: Matter is neither created nor destroyed.',
          'Therefore, equations must be balanced: atoms on the left must equal atoms on the right.',
          'Types: Combination, Decomposition, Displacement, and Double Displacement.',
          'Evidence: Color change, gas release, precipitate formation, or temperature change.',
        ],
        realWorldAnalogy: 'Baking a cake: flour + sugar + eggs + heat undergo an irreversible reaction to form cake. You still have all the atoms, just rearranged!',
        formula: 'Reactants ➔ Products   e.g. 2H₂ + O₂ ➔ 2H₂O',
      };
    }

    if (topicNormalized.includes('motion') || topicNormalized.includes('friction')) {
      return {
        title: 'Laws of Motion & Friction',
        summary: "Newton's laws explain how objects interact and move when forces are applied.",
        keyPoints: [
          "1st Law (Inertia): An object stays at rest or constant velocity unless an external force acts.",
          "2nd Law: Force equals mass times acceleration (F = ma).",
          "3rd Law: For every action, there is an equal and opposite reaction.",
          "Friction opposes relative motion between contacting surfaces.",
        ],
        realWorldAnalogy: 'Wearing seatbelts stops you when a car suddenly brakes because of inertia!',
        formula: 'F = m · a   |   f_friction ≤ μ · N',
      };
    }

    // Default concept response
    return {
      title: `${options.topic} - Key Learning Insights`,
      summary: `A fundamental topic in ${options.subject} structured for conceptual mastery.`,
      keyPoints: [
        'Break complex definitions into simple visual components.',
        'Identify the underlying rules and core variables.',
        'Practice 3-5 standard textbook examples to build confidence.',
        'Test yourself with the quick checkpoint quiz.',
      ],
      realWorldAnalogy: 'Building a Lego structure: start with a sturdy base before adding complex pieces.',
    };
  },

  /**
   * Draft contextual parent communications in English, Hindi, or Marathi
   */
  draftParentMessage(options: ParentMessageOptions): string {
    const catchupLink = options.includeCatchupLink
      ? `\n\n📌 Student Catch-up Plan: https://eduguard.school/catchup/${encodeURIComponent(options.studentName.toLowerCase().replace(/ /g, '-'))}`
      : '';

    if (options.language === 'hi') {
      // Hindi Drafts
      if (options.messageType === 'Missed class alert') {
        return `नमस्ते ${options.parentName} जी,\n\nआशा है आप सकुशल होंगे। ${options.studentName} इस सप्ताह ${options.missedClassesCount} कक्षाओं (${options.missedSubjects.join(', ')}) में उपस्थित नहीं हो सके। हमने एक विशेष कैच-अप योजना (वीडियो, नोट्स और अभ्यास प्रश्न) तैयार की है ताकि वे आसानी से समझ सकें।\n\nकृपया उन्हें शुक्रवार तक इसे पूरा करने के लिए प्रेरित करें। किसी भी सहायता के लिए मैं सदैव उपलब्ध हूँ।${catchupLink}\n\nसादर,\nकक्षा शिक्षक, कक्षा 10`;
      }
      if (options.messageType === 'Progress update') {
        return `नमस्ते ${options.parentName} जी,\n\nयह बताते हुए अत्यंत प्रसन्नता हो रही है कि ${options.studentName} ने इस सप्ताह कक्षा की गतिविधियों और प्रश्नों के हल में बहुत अच्छा सुधार दिखाया है। उनकी मेहनत सराहनीय है।\n\nकृपया घर पर भी उनका उत्साहवर्धन जारी रखें।${catchupLink}\n\nसादर,\nकक्षा शिक्षक`;
      }
      if (options.messageType === 'Meeting request') {
        return `नमस्ते ${options.parentName} जी,\n\nमैं ${options.studentName} की आगामी परीक्षा की तैयारी और अध्ययन प्रगति पर चर्चा करने हेतु आपसे 10 मिनट की संक्षिप्त बैठक का अनुरोध करना चाहता हूँ। कृपया अपने सुविधानुसार समय की पुष्टि करें।\n\nसादर,\nकक्षा शिक्षक`;
      }
      if (options.messageType === 'Appreciation') {
        return `नमस्ते ${options.parentName} जी,\n\n${options.studentName} ने आज सहपाठियों की गणित के कठिन प्रश्नों में बहुत लगन से सहायता की। उनका यह सहयोगी व्यवहार प्रशंसनीय है।\n\nहार्दिक शुभकामनाएँ,\nकक्षा शिक्षक`;
      }
      return `नमस्ते ${options.parentName} जी,\n\nयह ${options.studentName} की मासिक शैक्षणिक प्रगति एवं शुल्क सम्बन्धी औपचारिक सूचना है। कृपया विद्यालय कार्यालय से संपर्क करें।\n\nसादर,\nप्रशासनिक कार्यालय`;
    }

    if (options.language === 'mr') {
      // Marathi Drafts
      if (options.messageType === 'Missed class alert') {
        return `नमस्कार ${options.parentName} जी,\n\nआशा आहे आपण कुशल असाल. ${options.studentName} या आठवड्यात ${options.missedClassesCount} तासिकांमध्ये (${options.missedSubjects.join(', ')}) उपस्थित राहू शकला नाही. आम्ही त्यांच्यासाठी विशेष रिव्हिजन प्लॅन (व्हिडिओ आणि सराव प्रश्न) तयार केला आहे.\n\nकृपया त्यांना शुक्रवारपर्यंत हा अभ्यास पूर्ण करण्यास प्रोत्साहन द्या. काही शंका असल्यास मी नेहमी उपलब्ध आहे.${catchupLink}\n\nआपला नम्र,\nवर्ग शिक्षक`;
      }
      if (options.messageType === 'Progress update') {
        return `नमस्कार ${options.parentName} जी,\n\nसांगण्यास आनंद होतो की ${options.studentName} ने या आठवड्यात अभ्यासात खूप छान प्रगती दाखवली आहे. त्यांचा आत्मविश्वास वाढत आहे.\n\nअसेच प्रोत्साहन देत राहा.${catchupLink}\n\nआपला नम्र,\nवर्ग शिक्षक`;
      }
      return `नमस्कार ${options.parentName} जी,\n\n${options.studentName} च्या शैक्षणिक प्रगतीविषयी चर्चा करण्यासाठी कृपया एक लहान बैठक निश्चित करावी ही विनंती.\n\nआपला नम्र,\nवर्ग शिक्षक`;
    }

    // Default: English drafts
    if (options.messageType === 'Missed class alert') {
      if (options.tone === 'Urgent') {
        return `Dear ${options.parentName},\n\nUrgent Notice: ${options.studentName} has missed ${options.missedClassesCount} crucial classes this week (${options.missedSubjects.join(' & ')}). Foundational concepts were covered which will impact upcoming board assessments.\n\nPlease ensure ${options.studentName} completes the prioritized catch-up modules immediately.${catchupLink}\n\nRegards,\nAcademic Intervention Team`;
      }
      if (options.tone === 'Formal') {
        return `Dear ${options.parentName},\n\nThis is an official communication regarding ${options.studentName}'s attendance. Our records indicate ${options.missedClassesCount} missed instructional sessions in ${options.missedSubjects.join(', ')}. A remediation syllabus and worksheet pack have been assigned.\n\nKindly acknowledge and ensure timely submission by Friday.${catchupLink}\n\nSincerely,\nClass Teacher, Class 10`;
      }
      // Friendly default (matches reference design exactly)
      return `Dear ${options.parentName},\n\nI hope you are well. ${options.studentName} missed ${options.missedClassesCount} classes this week (${options.missedSubjects.join(' and ')}). We have shared a short catch-up plan with videos, notes and practice questions so they can recover the topics easily.\n\nCould you please encourage them to complete it by Friday? I am happy to help if they have any doubts.${catchupLink}\n\nWarm regards,\nClass Teacher, Class 10`;
    }

    if (options.messageType === 'Progress update') {
      return `Dear ${options.parentName},\n\nI am delighted to share that ${options.studentName} has shown remarkable improvement this week, raising their average quiz score by 15%. Their proactive participation in class discussions is commendable.\n\nThank you for your ongoing support at home!${catchupLink}\n\nWarm regards,\nClass Teacher`;
    }

    if (options.messageType === 'Meeting request') {
      return `Dear ${options.parentName},\n\nI would like to invite you for a brief 10-minute parent-teacher check-in regarding ${options.studentName}'s learning pathway and upcoming project submissions. Please select a convenient slot from the options provided.\n\nWarm regards,\nClass Teacher, Class 10`;
    }

    if (options.messageType === 'Appreciation') {
      return `Dear ${options.parentName},\n\nJust a quick note of appreciation for ${options.studentName}. Today they stepped up to mentor fellow classmates during our peer study circle, demonstrating great leadership and subject mastery.\n\nPleased to have them in our class!\n\nWarm regards,\nClass Teacher`;
    }

    return `Dear ${options.parentName},\n\nThis is a friendly reminder from the school administration regarding term fee reconciliation and upcoming schedule notices for ${options.studentName}.\n\nWarm regards,\nSchool Accounts Office`;
  },

  /**
   * Make a drafted message shorter and crisper
   */
  shortenMessage(currentText: string): string {
    const lines = currentText.split('\n').filter(l => l.trim().length > 0);
    if (lines.length <= 2) return currentText;
    
    // Condensed version retaining core points
    const salutation = lines[0];
    const bodyParts = lines.slice(1, -2).join(' ');
    const signOff = lines.slice(-2).join('\n');

    const condensedBody = bodyParts
      .replace(/I hope you are well\.\s*/i, '')
      .replace(/Could you please encourage him to complete it by Friday\? I am happy to help if he has any doubts\./i, 'Please ensure completion by Friday. Feel free to reach out with any questions.')
      .replace(/We have shared a short catch-up plan with videos, notes and practice questions so he can recover the topics easily\./i, 'Catch-up modules with notes & questions have been shared.');

    return `${salutation}\n\n${condensedBody}\n\n${signOff}`;
  }
};
