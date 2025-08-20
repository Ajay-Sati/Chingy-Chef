import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// A friendly, cartoonish chef avatar in base64 to avoid external requests
const CHEF_AVATAR_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZDt9LmNscy0ye2ZpbGw6I2YyYWY4Yjt9LmNscy0ze2ZpbGw6I2M2NDIzZjt9LmNscy00e2ZpbGw6IzY2MmQxNDt9LmNscy01e2ZpbGw6I2ZmZTliNzt9PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImF2YXRhciI+PGNpcmNsZSBjbGFzcz0iY2xzLTEiIGN4PSI2NCIgY3k9IjY0IiByPSI2NCIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwMC4yNyw4Mi4zOWE0My42Nyw0My42NywwLDAsMS03Mi41NCwwQzEyLjc4LDk2LjQ2LDEwLDEwOS4wOSwxMCwxMTguNzRjMCwzLjQ0LDAsMy40NCwyLjA4LDQuNDZDOTAsMTMwLjU2LDEyOCwxMjAuMzIsMTI4LDExNC41MkMxMjgsOTkuMjUsMTE4LjI4LDg4LjQzLDEwMC4yNyw4Mi4zOVoiLz48cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik05Mi40NCw1My41N2ExLjY2LDEuNjYsMCwwLDAtMS4yOS4wOEEzNC41MSwzNC41MSwwLDAsMCw2NCw0NS4wN2E0NC42Myw0NC42MywwLDAsMC0yNy4yOSw4LjgxYTEuNjgsMS42OCwwLDAsMC0xLjg0LDIuOTIsMzYuMDgsMzYuMDgsMCwwLDEtMS44Myw0LjQ4Yy0uNzUsMS40Mi0uMzgsMi4zNywxLjA2LDEuOTRhNDguMDgsNDguMDgsMCwwLDEsNy43NS0uNzhjMS4xMy0uMDUsMi4xMi42NCwxLjYyLDEuODQtMS4yMywzLjA5LTYuMTgsMTUuMjYtOC4xNSwyMC4yN2ExLjY4LDEuNjgsMCwwLDAsMS40MSwyLjYybDEuNTUtLjI0YzE1LjcyLTIuNDYsMzAtMiw0Ni4yMi4xMmwxLjU3LjE3YzEuMTQtLjA5LDEuNjQtMS4zMSwxLjI1LTIuMjMtMy4xNi03LjQ2LTYuMDYtMTQuNjYtNy4wNi0xNy41Mi0uNTUtMS41MS4yMy0yLjQzLDEuMzYtMi4xMiwxLjY4LjQ4LDMuMzYsMSw1LDIsMy42OCwyLjIsMy4yNy0yLjczLDMuMTYtNC42QTM2LjM0LDM2LjM0LDAsMCwxLDkyLjQ0LDUzLjU3WiIvPjxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTc4Ljc5LDY4YTE0Ljg4LDE0Ljg4LDAsMCwxLTQuODgsMi4wOWMtMS4zOS41Ni0yLjUxLDEuMjYtNCwxLjExcy0yLjA5LTEuMzYtMi44MS0yLjUxYy0uMy0uNDgtLjY0LS45NC0xLTEuMzVzLTEuMzMtMS4wOS0yLjA5LTEuMzUtMi4xMy0uMy0yLjgxLDBhMTUuMzUsMTUuMzUsMCwwLDAtNy4yOSw0Ljk0Yy0uNzYuNzQtMSwxLjczLS43NSwyLjgxbDIuMDYsOC42NWMuMjUsMS4wNS43NSwxLjU1LDEuODMsMS4zNWw1LjE1LS45NGMyLjU1LS40OCw1LjE1LS45NCw3LjczLS4zMWw3LjczLDEuODMsNS4zMS4xOWMxLS4xMywxLjQzLS43LDEuNTYtMS42OWwxLjU4LTkuNTRDODAuMTgsNjkuMTUsNzkuODMsNjgsNzguNzksNjhaIi8+PHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNzguNjIsNDMuMDVBNi4zLDYuMywwLDAsMCw3NS41LDQyYTguMjIsOC4yMiwwLDAsMC02LjE2LTIuODEsMTAuMTIsMTAuMTIsMCwwLDAtNy41NywzLjQxLDYuMyw2LjMsMCwwLDAtMi44MSw1LjQ0QTYuOTEsNi45MSwwLDAsMCw1NCw1M2E3LjQzLDcuNDMsMCwwLDAsMTAsMEE3LDcsMCwwLDAsNzMsNTNhNy40Myw3LjQzLDAsMCwwLDEwLDBhNi45MSw2LjkxLDAsMCwwLTItNC41NUE2LjI1LDYuMjUsMCwwLDAsNzguNjIsNDMuMDVaIi8+PHBhdGggY2xhc3M9ImNscy01IiBkPSJNOTIuNzMsMzEuMjZhMjMuNjYsMjMuNjYsMCwwLDAtMTQtOS4wOGMtNS43OC00Ljc2LTEyLjU3LTguMjItMjEuNTUtNi4zMy00LjE2Ljg3LTkuNDgsMi40OC0xNCwyLjgxLTUuMTUtLjM2LTcuMzQtMy42Mi0xMC4xNi03LjMxQzMwLjY2LDMuMTIsMjUuMzEsMS4wOSwxOS42NiwyLjA2Yy0xMS4zMSwxLjkzLTQuNTUsMjEuNTUsNC4xMywyNy4yOWExNSwxNSwwLDAsMCwxMC40Myw1LjY5YzUuMywxLjMzLDEwLjYsMy4yNSwxNS43NSwzLjQ0LDEuMDUsMCwyLjA5LDAsMy4xMy0uMTksOS42MS0xLjc3LDIwLjMzLTkuODMsMjcuMDYtMTIuNDZDOTEsMjQuMTIsOTIuODMsMjEuMjYsOTIuNzMsMzEuMjZaIi8+PC9nPjwvc3ZnPg==";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["recipeName", "ingredients", "steps"],
};

type Recipe = {
  recipeName: string;
  ingredients: string[];
  steps: string[];
};

const App = () => {
  const [dish, setDish] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fullRecipeSteps = recipe ? [`Ingredients:\n\n- ${recipe.ingredients.join('\n- ')}`, ...recipe.steps] : [];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/-/g, ''));
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  useEffect(() => {
    if (recipe) {
      speakText(fullRecipeSteps[currentStepIndex]);
    }
  }, [currentStepIndex, recipe]);

  const handleFetchRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dish.trim()) {
      setError("Please enter a dish name.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    window.speechSynthesis.cancel();


    try {
      const response = await ai.models.generateContent({
        model,
        contents: `Generate a recipe for ${dish}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: recipeSchema,
        },
      });

      const parsedRecipe: Recipe = JSON.parse(response.text);
      if (!parsedRecipe.recipeName || !parsedRecipe.ingredients || !parsedRecipe.steps) {
        throw new Error("Sorry, I couldn't understand the recipe format.");
      }
      setRecipe(parsedRecipe);
      setCurrentStepIndex(0);
    } catch (err) {
      console.error(err);
      setError("Sorry, I couldn't fetch that recipe. Please try another dish.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < fullRecipeSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const repeatCurrentStep = () => {
    if (recipe) {
      speakText(fullRecipeSteps[currentStepIndex]);
    }
  };

  const handleStartOver = () => {
    setRecipe(null);
    setDish('');
    setError(null);
    window.speechSynthesis.cancel();
  };
  
  const renderContent = () => {
    if (recipe) {
      return (
        <div className="recipe-view">
          <h2>{recipe.recipeName}</h2>
          <div className="progress-indicator">
            {currentStepIndex === 0 ? 'Ingredients' : `Step ${currentStepIndex} of ${recipe.steps.length}`}
          </div>
          <div className="step-display">
            {currentStepIndex === 0 ? (
                <ul>
                    {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
            ) : (
                <p>{fullRecipeSteps[currentStepIndex]}</p>
            )}
          </div>
          <div className="nav-buttons">
            <button className="btn btn-secondary" onClick={goToPrevStep} disabled={currentStepIndex === 0}>
                &#x2B05; Prev
            </button>
            <button className="btn btn-secondary" onClick={repeatCurrentStep}>
                &#x1F50A; Repeat
            </button>
            <button className="btn btn-secondary" onClick={goToNextStep} disabled={currentStepIndex === fullRecipeSteps.length - 1}>
                Next &#x27A1;
            </button>
          </div>
           <button className="btn btn-primary" onClick={handleStartOver}>
            Cook Something Else
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={handleFetchRecipe} className="form-container">
        <p className="subtitle">What delicious dish would you like to cook today?</p>
        <input
          type="text"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          placeholder="e.g., Chocolate Chip Cookies"
          className="input-field"
          aria-label="Dish name"
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Get Recipe
        </button>
      </form>
    );
  };

  return (
    <div className="container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>Chingy Chef is finding the perfect recipe...</p>
        </div>
      )}
      {error && !isLoading && (
        <div className="error-message">
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => setError(null)}>Try Again</button>
        </div>
      )}
      <header className="header">
        <img src={CHEF_AVATAR_BASE64} alt="Chingy Chef Avatar" className="chef-avatar" />
        <h1 className="title">Chingy Chef</h1>
      </header>
      {renderContent()}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);