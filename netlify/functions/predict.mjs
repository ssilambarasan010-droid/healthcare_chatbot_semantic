export const handler = async (event) => {
   if (event.httpMethod !== "POST") {
      return {
         statusCode: 405,
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            error: "Only POST requests are allowed"
         })
      };
   }

   try {
      const body = JSON.parse(event.body || "{}");

      const question = body.text || body.question || "";

      if (!question.trim()) {
         return {
            statusCode: 400,
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               error: "Question is required"
            })
         };
      }

      return {
         statusCode: 200,
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            answer: `You asked: ${question}`,
            confidence: 1,
            status: "success"
         })
      };
   } catch (error) {
      return {
         statusCode: 400,
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            error: "Invalid request"
         })
      };
   }
};