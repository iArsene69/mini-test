import { FormMessage } from "@/components/ui/form";
import { FieldApi } from "@tanstack/react-form";

export default function FieldInfo({
  field,
}: {
  field: FieldApi<any, any, any, any>;
}) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em className="text-destructive-foreground">{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? <em>Validating...</em> : null}
    </>
  );
}
