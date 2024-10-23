import { useEffect, useState } from "react";
import "./App.css";
import { ATTRIBUTE_LIST, CLASS_LIST, SKILL_LIST } from "./consts";
import { Attributes, Class } from "./types";

function App() {
  // Attributes
  const [strength, setStrength] = useState<number>(7);
  const [dexterity, setDexterity] = useState<number>(9);
  const [constitution, setConstitution] = useState<number>(10);
  const [intelligence, setIntelligence] = useState<number>(1);
  const [wisdom, setWisdom] = useState<number>(12);
  const [charisma, setCharisma] = useState<number>(20);

  const attributes: Attributes = {
    Strength: strength,
    Dexterity: dexterity,
    Constitution: constitution,
    Intelligence: intelligence,
    Wisdom: wisdom,
    Charisma: charisma,
  };

  function incrementCharacterAttribute(attribute: keyof Attributes) {
    switch (attribute) {
      case "Strength":
        setStrength(strength + 1);
        break;
      case "Dexterity":
        setDexterity(dexterity + 1);
        break;
      case "Constitution":
        setConstitution(constitution + 1);
        break;
      case "Intelligence":
        setIntelligence(intelligence + 1);
        break;
      case "Wisdom":
        setWisdom(wisdom + 1);
        break;
      case "Charisma":
        setCharisma(charisma + 1);
        break;
    }
  }

  function decrementCharacterAttribute(attribute: keyof Attributes) {
    switch (attribute) {
      case "Strength":
        setStrength(strength - 1);
        break;
      case "Dexterity":
        setDexterity(dexterity - 1);
        break;
      case "Constitution":
        setConstitution(constitution - 1);
        break;
      case "Intelligence":
        setIntelligence(intelligence - 1);
        break;
      case "Wisdom":
        setWisdom(wisdom - 1);
        break;
      case "Charisma":
        setCharisma(charisma - 1);
        break;
    }
  }

  // Classes
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  function meetsClassRequirements(className: Class) {
    const classAttributes = CLASS_LIST[className];
    return (Object.keys(classAttributes) as (keyof Attributes)[]).every(
      (attribute) => attributes[attribute] >= classAttributes[attribute]
    );
  }

  function abilityModifier(attribute: number) {
    return Math.floor((attribute - 10) / 2);
  }

  // Skills
  const [availableSkillPoints, setAvailableSkillPoints] = useState<number>(10 + 4 * intelligence);
  const [skillPointsSpent, setSkillPointsSpent] = useState<Record<string, number>>({});

  const totalSkillValues = Object.keys(skillPointsSpent).reduce((acc, skillName) => {
    const pointsSpent = skillPointsSpent[skillName] || 0;
    const abilityModifierValue = abilityModifier(
      attributes[
        SKILL_LIST.find((skill) => skill.name === skillName)?.attributeModifier as keyof Attributes
      ]
    );
    return acc + pointsSpent + abilityModifierValue;
  }, 0);

  function incrementSkillPoints(skillName: string) {
    setSkillPointsSpent((prev) => {
      if (totalSkillValues >= availableSkillPoints) {
        alert("You have no more skill points to spend!");
        return prev;
      }
      return { ...prev, [skillName]: (prev[skillName] || 0) + 1 };
    });
  }

  function decrementSkillPoints(skillName: string) {
    setSkillPointsSpent((prev) => {
      if (prev[skillName] === 0) {
        return prev;
      }
      return { ...prev, [skillName]: (prev[skillName] || 0) - 1 };
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
      </header>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <section className="App-section">
          <h2>Attributes</h2>
          {ATTRIBUTE_LIST.map((attribute) => (
            <div key={attribute}>
              {attribute}: {attributes[attribute as keyof Attributes]}
              <div>
                <button onClick={() => decrementCharacterAttribute(attribute as keyof Attributes)}>
                  -
                </button>
                <button onClick={() => incrementCharacterAttribute(attribute as keyof Attributes)}>
                  +
                </button>
              </div>
              <div>Modifier: {abilityModifier(attributes[attribute as keyof Attributes])}</div>
              <br />
            </div>
          ))}
        </section>
        <section className="App-section">
          {/* need to use keys of class list to iterate through dictionary */}
          <h2>Classes</h2>
          {Object.keys(CLASS_LIST).map((className) => (
            <div
              key={className}
              style={{
                color: meetsClassRequirements(className as keyof typeof CLASS_LIST)
                  ? "green"
                  : "red",
                cursor: "pointer",
              }}
              onClick={() => setSelectedClass(className as Class)}>
              {className}
            </div>
          ))}
        </section>
        {selectedClass && (
          <section className="App-section">
            <h2>Minimum Required Statistics for {selectedClass}</h2>
            <ul>
              {Object.entries(CLASS_LIST[selectedClass]).map(([attribute, value]) => (
                <p key={attribute}>
                  {attribute}: {value}
                </p>
              ))}
            </ul>
            <button onClick={() => setSelectedClass(null)}>Clear Selected Class</button>
          </section>
        )}
        <section className="App-section">
          <h2>Skills</h2>
          <p>Total skill points available: {availableSkillPoints}</p>
          {SKILL_LIST.map((skill) => (
            <div key={skill.name}>
              <div>
                {skill.name} <p>Points: {skillPointsSpent[skill.name] || 0}</p>
              </div>
              <div>
                <div>
                  <button onClick={() => decrementSkillPoints(skill.name)}>-</button>
                  <button onClick={() => incrementSkillPoints(skill.name)}>+</button>
                </div>
                <p>
                  Modifier ({skill.attributeModifier}):{" "}
                  {abilityModifier(attributes[skill.attributeModifier as keyof Attributes])}
                </p>
                <p>
                  Total:{" "}
                  {(skillPointsSpent[skill.name] || 0) +
                    abilityModifier(attributes[skill.attributeModifier as keyof Attributes])}
                </p>
              </div>
              <br />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;
