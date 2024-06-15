export type FileProp = {
  name: string;
  type: string;
  size: number;
  uri: string;
};

export type FormType = {
  title: string;
  video: FileProp;
  thumbnail: FileProp;
  prompt: string;
}