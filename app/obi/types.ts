export type BeltColorId = 'white' | 'blue' | 'purple' | 'brown' | 'black';
export type ThreadColorId = 'gold' | 'silver' | 'white' | 'black' | 'red' | 'navy';
export type FontId = 'gyosho' | 'kaisho' | 'gothic';

export interface BeltColor {
  id: BeltColorId;
  name: string;
  ja: string;
  hex: string;
}

export interface ThreadColor {
  id: ThreadColorId;
  name: string;
  hex: string;
}

export interface FontInfo {
  name: string;
  ja: string;
}

export interface OrderState {
  beltColor: BeltColorId;
  threadColorA: ThreadColorId;
  threadColorB: ThreadColorId;
  font: FontId;
  textA: string;
  textB: string;
}
