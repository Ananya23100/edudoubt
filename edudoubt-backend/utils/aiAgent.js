/**
 * Simulated AI Agent
 * (Examiner-friendly + predictable)
 */

function analyzeDoubt(question) {
  // Simple heuristic-based confidence
  let confidence = Math.random(); // 0 to 1

  let aiAnswer = "This is an AI-generated explanation for your doubt.";

  return {
    aiAnswer,
    confidence
  };
}

module.exports = { analyzeDoubt };
