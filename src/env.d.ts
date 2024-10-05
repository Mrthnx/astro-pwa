/// <reference path="../.astro/types.d.ts" />

export interface Plant {
  id: number;
  code: string;
  description: string;
  areas: Area[];
}

interface Area {
  id: number;
  code: string;
  description: string;
  systems: System[];
}

interface System {
  id: number;
  code: string;
  description: string;
  mawois: Mawoi[];
}

interface Mawoi {
  id: number;
  code: string;
  description: string;
  points: Point[];
}

interface Point {
  id: number;
  code: string;
  description: string;
}

