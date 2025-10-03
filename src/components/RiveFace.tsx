import {
  useRive,
  useViewModel,
  useViewModelInstance,
  useViewModelInstanceColor,
  useViewModelInstanceNumber,
} from "@rive-app/react-canvas";
import { useEffect } from "react";

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Normalize hex string
  let sanitized = hex.trim().replace(/^#/, "");

  // Support shorthand (#abc → #aabbcc)
  if (sanitized.length === 3) {
    sanitized = sanitized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (!/^[0-9A-Fa-f]{6}$/.test(sanitized)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);

  return { r, g, b };
}

function intToHex(color: number): string {
  // Ensure we work with the lower 24 bits only (ignore alpha channel if present)
  const hex = (color & 0xffffff).toString(16).toUpperCase();

  // Pad with leading zeros if necessary
  return `#${hex.padStart(6, "0")}`;
}

const RiveFace = () => {
  const { rive, RiveComponent } = useRive({
    // Load a local riv `clean_the_car.riv` or upload your own!
    src: "/rive/face_example.riv",
    // Be sure to specify the correct state machine (or animation) name
    stateMachines: "StateMachine",
    // Autoplay the state machine
    autoplay: true,
    // This uses the view model instance defined in Rive
    autoBind: true,
  });

  const viewModel = useViewModel(rive, { name: "Main" });
  const vmi = useViewModelInstance(viewModel, { rive });

  const { value: eyeColor, setRgb: setEyeColor } = useViewModelInstanceColor(
    "eyeColor",
    vmi
  );

  const { setRgb: setBeardColor } = useViewModelInstanceColor(
    "beardColor",
    vmi
  );

  const { value: beardType, setValue: setBeardType } =
    useViewModelInstanceNumber("beardType", vmi);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    const { r, g, b } = hexToRgb(e.target.value);
    console.log(r, g, b);
    setEyeColor(r, g, b);
  };

  const handleRadioSelect = (type: number) => {
    console.log(type);

    switch (type) {
      case 0:
        // Rot
        setEyeColor(255, 0, 0);
        break;
      case 1:
        // Grün
        setEyeColor(0, 255, 0);
        break;
      case 2:
        // Braun
        setEyeColor(150, 75, 0);
        break;
      case 3:
        // Blau
        setEyeColor(0, 0, 255);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (eyeColor) {
      console.log("Eye color changed:", intToHex(eyeColor));
    }
  }, [eyeColor]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <RiveComponent className="w-96 h-96" />

      <fieldset className="bg-neutral-700 p-3 rounded-xl border border-neutral-600">
        <h3>
          <legend className="text-white">Augenfarbe</legend>
        </h3>
        <div className="flex gap-3">
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="phenotype"
              id="phenotype1"
              onChange={() => handleRadioSelect(0)}
            />
            <label htmlFor="phenotype1" className="text-white">
              Rot
            </label>
          </div>
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="phenotype"
              id="phenotype1"
              onChange={() => handleRadioSelect(1)}
            />
            <label htmlFor="phenotype1" className="text-white">
              Grün
            </label>
          </div>
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="phenotype"
              id="phenotype2"
              onChange={() => handleRadioSelect(2)}
            />
            <label htmlFor="phenotype2" className="text-white">
              Braun
            </label>
          </div>
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="phenotype"
              id="phenotype3"
              onChange={() => handleRadioSelect(3)}
            />
            <label htmlFor="phenotype3" className="text-white">
              Blau
            </label>
          </div>

          <div className="flex gap-2 p-2">
            <input
              type="color"
              value={intToHex(eyeColor || 0)}
              onChange={handleColorChange}
              id="colorPicker"
              name="colorPicker"
            />
            <label htmlFor="colorPicker" className="text-white">
              Custom
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset className="bg-neutral-700 p-3 rounded-xl border border-neutral-600">
        <h3>
          <legend className="text-white">Bartstil</legend>
        </h3>
        <div className="flex gap-4">
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="beardType"
              id="beardType1"
              checked={beardType === 0}
              onChange={() => setBeardType(0)} // Kein Bart
            />
            <label htmlFor="beardType1" className="text-white">
              Kein Bart
            </label>
          </div>
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="beardType"
              id="beardType2"
              checked={beardType === 1}
              onChange={() => setBeardType(1)} // Schnurrbart1
            />
            <label htmlFor="beardType2" className="text-white">
              Schnurrbart
            </label>
          </div>
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="beardType"
              id="beardType3"
              checked={beardType === 2}
              onChange={() => setBeardType(2)} // Vollbart
            />
            <label htmlFor="beardType3" className="text-white">
              Vollbart
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset className="bg-neutral-700 p-3 rounded-xl border border-neutral-600">
        <h3>
          <legend className="text-white">Bartfarbe</legend>
        </h3>
        <div className="flex gap-4">
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="beardPhenotype"
              id="beardPhenotype1"
              onChange={() => setBeardColor(139, 69, 19)} // SaddleBrown
            />
            <label htmlFor="beardPhenotype1" className="text-white">
              Braun
            </label>
          </div>
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="beardPhenotype"
              id="beardPhenotype2"
              onChange={() => setBeardColor(0, 0, 0)} // Schwarz
            />
            <label htmlFor="beardPhenotype2" className="text-white">
              Schwarz
            </label>
          </div>
          <div className="flex gap-2 p-2">
            <input
              type="radio"
              name="beardPhenotype"
              id="beardPhenotype3"
              onChange={() => setBeardColor(255, 255, 255)} // Weiß
            />
            <label htmlFor="beardPhenotype3" className="text-white">
              Weiß
            </label>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default RiveFace;
