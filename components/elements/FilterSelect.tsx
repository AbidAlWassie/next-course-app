'use client';

import { useState, useEffect } from 'react';

interface Subject {
  id: string;
  subName: string;
}

interface FilterSelectProps {
  subjects: Subject[];
}

export function FilterSelect({ subjects }: FilterSelectProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const subjectIdsInput = document.getElementById('subjectIdsInput') as HTMLInputElement;
    if (subjectIdsInput) {
      subjectIdsInput.value = selectedIds.join(',');
    }
  }, [selectedIds]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedValues = selectedOptions.map(option => option.value);
    setSelectedIds(selectedValues);
  };

  return (
    <>
      <select
        id="subjectSelect"
        name="subjects"
        multiple
        className="px-2 py-2 my-2 rounded-sm w-full"
        onChange={handleSelectChange}
      >
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.subName}
          </option>
        ))}
      </select>

      <input
        type="text"
        id="subjectIdsInput"
        name="subs"
        readOnly
      />
    </>
  );
}
