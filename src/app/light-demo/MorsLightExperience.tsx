"use client";

import { useCallback, useEffect, useState, type CSSProperties, type RefObject } from "react";
import "./light-demo.css";
import { MorsLightCanvas } from "./light/MorsLightCanvas";
import { COLOR_PRESETS, INITIAL_LIGHT, type LightingSettings } from "./light/config";

type Props = {
  mediaRef: RefObject<HTMLPictureElement | null>;
  imageRef: RefObject<HTMLImageElement | null>;
  roomBright: boolean;
  onRoomBrightChange: (bright: boolean) => void;
};

export function MorsLightExperience({ mediaRef, imageRef, roomBright, onRoomBrightChange }: Props) {
  const [lighting, setLighting] = useState<LightingSettings>(INITIAL_LIGHT);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const updateLighting = useCallback((patch: Partial<LightingSettings>) => {
    setLighting((current) => ({ ...current, ...patch }));
  }, []);
  const turnRoomOn = useCallback(() => onRoomBrightChange(true), [onRoomBrightChange]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [settingsOpen]);

  function resetLight() {
    setLighting(INITIAL_LIGHT);
  }

  return (
    <div
      className="experience-shell is-embedded"
      aria-label="Interactive pendant light"
      style={{ "--lamp-color": lighting.color } as CSSProperties}
    >
      <MorsLightCanvas
        mediaRef={mediaRef}
        imageRef={imageRef}
        lighting={lighting}
        roomBright={roomBright}
        onLightingChange={updateLighting}
        onLampTouch={turnRoomOn}
      />
      <aside
        className={`light-controls embedded-light-controls ${settingsOpen ? "is-expanded" : "is-collapsed"}`}
        aria-label="Light controls"
      >
        <div className="control-heading">
          <div>
            <p>LIGHT CONTROL</p>
            <span>SPOTLIGHT ON · ROOM {roomBright ? "BRIGHT" : "DARK"}</span>
          </div>
          <button
            type="button"
            className={`power-toggle${roomBright ? " is-on" : ""}`}
            onClick={() => onRoomBrightChange(!roomBright)}
            aria-pressed={roomBright}
            aria-label={roomBright ? "Turn off the room lights" : "Turn on the room lights"}
          >
            <span />{roomBright ? "TURN OFF ROOM" : "TURN ON ROOM"}
          </button>
          <button
            type="button"
            className="settings-toggle"
            onClick={() => setSettingsOpen((open) => !open)}
            aria-expanded={settingsOpen}
            aria-controls="embedded-light-settings"
            aria-label={settingsOpen ? "Close light settings" : "Open light settings"}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6">
              {settingsOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <><path d="M4 7h7m4 0h5M4 17h3m4 0h9" /><circle cx="13" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>}
            </svg>
          </button>
        </div>

        {!settingsOpen && !roomBright && (
          <p className="room-light-hint"><span />Switch on to reveal the room</p>
        )}

        <div id="embedded-light-settings" className="light-settings-panel" hidden={!settingsOpen}>
        <label className="control-row">
          <span className="control-label"><b>BEAM</b><output>{lighting.angle}°</output></span>
          <input
            type="range"
            min="16"
            max="58"
            step="1"
            value={lighting.angle}
            onChange={(event) => updateLighting({ angle: Number(event.currentTarget.value) })}
            aria-label="Beam angle"
          />
        </label>

        <label className="control-row">
          <span className="control-label"><b>BRIGHTNESS</b><output>{lighting.brightness} lm</output></span>
          <input
            type="range"
            min="300"
            max="2600"
            step="50"
            value={lighting.brightness}
            onChange={(event) => updateLighting({ brightness: Number(event.currentTarget.value) })}
            aria-label="Light brightness"
          />
        </label>

        <div className="control-row color-control">
          <span className="control-label"><b>COLOR</b><output>{lighting.color.toUpperCase()}</output></span>
          <div className="color-options">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                className={lighting.color === color ? "is-active" : ""}
                style={{ "--swatch": color } as CSSProperties}
                onClick={() => updateLighting({ color })}
                aria-label={`Set light color to ${color}`}
                aria-pressed={lighting.color === color}
              />
            ))}
            <label className="custom-color" aria-label="Choose a custom light color">
              <input
                type="color"
                value={lighting.color}
                onChange={(event) => updateLighting({ color: event.currentTarget.value })}
              />
              <span>+</span>
            </label>
          </div>
        </div>

        <button type="button" className="reset-light" onClick={resetLight}>
          RESET LIGHT <span aria-hidden="true">↗</span>
        </button>
        </div>
      </aside>
    </div>
  );
}
