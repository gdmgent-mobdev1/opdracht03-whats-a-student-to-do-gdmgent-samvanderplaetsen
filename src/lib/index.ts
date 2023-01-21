interface State {
  text: string, 
  description: string, 
  comments?: string[];
}

type Property = keyof State;

export type {State, Property}