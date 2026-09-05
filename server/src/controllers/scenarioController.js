const scenarioService = require('../services/scenarioService');

const listScenarios = async (req, res, next) => {
  try {
    const { category, difficulty, targetLanguage, search } = req.query;
    const scenarios = await scenarioService.listScenarios({
      category,
      difficulty,
      targetLanguage,
      search
    });

    res.status(200).json({
      success: true,
      data: scenarios
    });
  } catch (err) {
    next(err);
  }
};

const getScenario = async (req, res, next) => {
  try {
    const scenario = await scenarioService.getScenarioById(req.params.id);
    res.status(200).json({
      success: true,
      data: scenario
    });
  } catch (err) {
    next(err);
  }
};

const createScenario = async (req, res, next) => {
  try {
    const scenario = await scenarioService.createScenario(req.body);
    res.status(201).json({
      success: true,
      message: 'Scenario created successfully',
      data: scenario
    });
  } catch (err) {
    next(err);
  }
};

const startScenario = async (req, res, next) => {
  try {
    const result = await scenarioService.startScenarioSession(req.params.id, req.user._id);
    res.status(201).json({
      success: true,
      message: 'Scenario session started',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { listScenarios, getScenario, createScenario, startScenario };
