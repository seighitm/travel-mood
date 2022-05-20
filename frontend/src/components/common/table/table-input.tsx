import {Loader, TextInput} from "@mantine/core";
import React from "react";
import {Search} from "../../../assets/Icons";

const TableInput = ({value, onChange, isFetched}: any) => {
  return (
    <TextInput
      id="global-filter"
      size="md"
      icon={<Search size={20}/>}
      value={value}
      onChange={({currentTarget}: any) => onChange(currentTarget.value)}
      placeholder="Search by title or user name"
      rightSection={
        value?.length > 0 && !isFetched ? <Loader size="xs"/> : null
      }
    />
  );
};

export default TableInput;
