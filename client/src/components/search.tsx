import { SearchResults } from "@/components/search-results";
import { Input } from "@/components/ui/input";
import { Field } from "./ui/field";
import { Button } from "./ui/button";
import type { User } from "@/services/auth";

export type SearchProps = {
  query: string;
  results: User[];
  loading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelect: (user: User) => void;
};
export default function Search({
  query,
  results,
  loading,
  handleInputChange,
  handleSelect,
}: SearchProps) {
  return (
    <div className="relative">
      <Field className="mt-4" orientation="horizontal">
        <Input
          type="search"
          placeholder="Search User by name or email..."
          value={query}
          onChange={handleInputChange}
        />
        <Button>Search</Button>
      </Field>

      {query && (
        <SearchResults
          results={results}
          loading={loading}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
}
