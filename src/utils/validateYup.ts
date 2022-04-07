import * as Yup from "yup";

const validateYup = (schema: Yup.AnySchema, values: any): true | string[] => {
  try {
    schema.validateSync(values);
    return true;
  } catch (e: any) {
    return e.errors as string[];
  }
};
export default validateYup;
