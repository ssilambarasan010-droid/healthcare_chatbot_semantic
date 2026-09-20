
export const handler = async (event) => {
   if (event.httpMethod !== "POST") {
      return {
         statusCode: 405,
         body: JSON.stringify({
            error: "Only POST requests are allowed"
         })
      };
   }

   try {
      const body = JSON.parse(event.body || "{}");
      const question = (body.text || body.question || "").toLowerCase().trim();

      if (!question) {
         return {
            statusCode: 400,
            body: JSON.stringify({
               error: "Question is required"
            })
         };
      }

      let answer;
      let confidence = 0.85;

      if (question.includes("headache") || question.includes("head pain")) {
         answer = "Headache can have different causes. Rest, drink enough water, and monitor your symptoms. Seek medical care if the headache is sudden or severe.";
      } else if (question.includes("fever")) {
         answer = "Fever can have different causes. Drink fluids and monitor your temperature. Seek medical advice if it is high or persistent.";
      } else if (question.includes("cough") || question.includes("cold")) {
         answer = "Cough and cold symptoms can have different causes. Rest and drink fluids. Consult a healthcare professional if symptoms are severe or persistent.";
      } else if (question.includes("rash") || question.includes("itching")) {
         answer = "Skin rash and itching can have different causes. Avoid possible irritants and seek medical advice if the rash spreads or becomes severe.";
      } else if (question.includes("diabetes") || question.includes("blood sugar")) {
         answer = "Diabetes requires appropriate blood glucose monitoring and medical guidance. Consult a qualified healthcare professional.";
      } else if (question.includes("your name") || question.includes("who are you")) {
         answer = "My name is Smily. I am a healthcare information chatbot. I provide general information, not a medical diagnosis.";
         confidence = 1;
      } else {
         answer = "I could not find a matching healthcare topic. Please describe your symptoms clearly or consult a qualified healthcare professional.";
         confidence = 0.35;
      }

      return {
         statusCode: 200,
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            answer,
            confidence,
            status: "success"
         })
      };
   } catch (error) {
      return {
         statusCode: 400,
         body: JSON.stringify({
            error: "Invalid request"
         })
      };
   }
};