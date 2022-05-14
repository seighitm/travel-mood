import {Input, InputWrapper, Loader} from "@mantine/core";
import React from "react";
import {MagnifyingGlassIcon} from "@modulz/radix-icons";

const TableInput = ({value, onChange, isFetched}: any) => {
  return (
    <InputWrapper
      id="global-filter"
      size="md"
    >
      <Input
        id="global-filter"
        size="md"
        icon={<MagnifyingGlassIcon style={{width: "20px"}}/>}
        value={value}
        onChange={({currentTarget}: any) => onChange(currentTarget.value)}
        placeholder="Search by title or user name"
        rightSection={
          value?.length > 0 && !isFetched ? <Loader size="xs"/> : null
        }
      />
    </InputWrapper>
  );
};

export default TableInput;
