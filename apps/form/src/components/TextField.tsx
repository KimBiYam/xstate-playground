interface TextFieldProps
  extends Pick<
    React.InputHTMLAttributes<HTMLInputElement>,
    "type" | "name" | "id" | "onChange" | "value"
  > {
  label: React.ReactNode;
}

export default function TextField({ label, ...props }: TextFieldProps) {
  return (
    <div>
      <label>
        {label}
        <input {...props} />
      </label>
    </div>
  );
}
