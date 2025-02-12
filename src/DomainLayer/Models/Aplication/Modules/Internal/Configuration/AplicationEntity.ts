export type ObjetcEntity = {
  Key?: string;
  Value: string;
  Name?: string;
};

export type AplicationEntity = ObjetcEntity & {
  Description?: string;
  CreatedAt?: Date;
  IsVisible?: boolean;
  IsEnabled?: boolean;
  ItemValues?: ObjetcEntity[];
};

export type AplicationGetEntity = AplicationEntity & {
  Ref: string;
};
