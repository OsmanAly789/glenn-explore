declare module 'threebox-plugin' {
  interface ThreeboxOptions {
    defaultLights?: boolean;
    [key: string]: any;
  }

  interface ModelOptions {
    obj: string;
    type: string;
    scale: {
      x: number;
      y: number;
      z: number;
    };
    units: string;
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  }

  interface Model {
    setCoords(coords: [number, number]): void;
    setRotation(rotation: { x: number; y: number; z: number }): void;
  }

  class Threebox {
    constructor(map: any, context: WebGLRenderingContext, options: ThreeboxOptions);
    loadObj(options: ModelOptions, callback: (model: Model) => void): void;
    add(model: Model): void;
    update(): void;
  }

  export { Threebox };
} 