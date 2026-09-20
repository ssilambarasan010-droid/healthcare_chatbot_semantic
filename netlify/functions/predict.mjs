
export const handler = async (event) => {
   try {
      if (event.httpMethod !== "POST") {
         return {
            statusCode: 405,
            body: JSON.stringify({
               error: "Only POST method is allowed",
            }),
         };
      }

      const body = JSON.parse(event.body || "{}");

      const question = String(
         body.text || body.question || ""
      ).toLowerCase().trim();

      if (!question) {
         return {
            statusCode: 400,
            body: JSON.stringify({
               error: "Question is required",
            }),
         };
      }

      let answer = "";
      let confidence = 0.85;

      if (
         question.includes("your name") ||
         question.includes("who are you") ||
         question.includes("what is your name")
      ) {
         answer =
            "My name is Smily. I am a healthcare information chatbot. I provide general information, not a medical diagnosis.";
         confidence = 1.0;
      } else if (
         question.includes("headache") ||
         question.includes("head pain")
      ) {
         answer =
            "Headaches can have different causes. Rest, drink enough water, and monitor your symptoms. Seek medical care if the headache is sudden, severe, or persistent.";
      } else if (
         question.includes("fever") ||
         question.includes("temperature")
      ) {
         answer =
            "Fever can have different causes. Drink fluids, rest, and monitor your temperature. Consult a healthcare professional if the fever is high or persistent.";
      } else if (
         question.includes("cough") ||
         question.includes("cold")
      ) {
         answer =
            "Cough and cold symptoms can have different causes. Rest and drink fluids. Consult a healthcare professional if symptoms are severe or continue.";
      } else if (
         question.includes("rash") ||
         question.includes("itching") ||
         question.includes("skin")
      ) {
         answer =
            "Skin rash and itching can have different causes. Avoid possible irritants and seek medical advice if the rash spreads, becomes severe, or is associated with breathing difficulty.";
      } else if (
         question.includes("diabetes") ||
         question.includes("blood sugar")
      ) {
         answer =
            "Diabetes involves blood glucose regulation. Follow medical guidance, monitor blood sugar as advised, and consult a qualified healthcare professional.";
      } else if (
         question.includes("anxiety") ||
         question.includes("stress") ||
         question.includes("stressed")
      ) {
         answer =
            "Feeling anxious or stressed can be difficult. Try slow breathing and talk to someone you trust. If these feelings continue or affect your daily life, consider speaking with a qualified mental health professional.";
      } else if (
         question.includes("emergency") ||
         question.includes("chest pain") ||
         question.includes("difficulty breathing")
      ) {
         answer =
            "If you are experiencing a medical emergency, severe chest pain, or difficulty breathing, contact your local emergency service or seek immediate medical attention.";
         confidence = 1.0;
      } else {
         answer =
            "I could not find a matching healthcare topic. Please describe your symptoms clearly or consult a qualified healthcare professional.";
         confidence = 0.35;
      }

      return {
         statusCode: 200,
         headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
         },
         body: JSON.stringify({
            answer,
            confidence,
            status: "success",
         }),
      };
   } catch (error) {
      console.error("Function error:", error);

      return {
         statusCode: 500,
         body: JSON.stringify({
            error: "Internal server error",
         }),
      };
   }
};