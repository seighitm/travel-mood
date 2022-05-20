import React from 'react';
import {Group, Text, ThemeIcon, UnstyledButton} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {FileTextIcon, Link2Icon, ReaderIcon, RocketIcon, SewingPinFilledIcon} from "@modulz/radix-icons";
import {InfoCircle, MessageDots, User, World} from "../../../assets/Icons";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
}

function MainLink({icon, color, label, link, matches}: MainLinkProps | any) {
  const navigate = useNavigate()
  return (
    <UnstyledButton
      onClick={() => navigate(link)}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>
        {matches &&
          <Text size="sm">{label}</Text>
        }
      </Group>
    </UnstyledButton>
  );
}

const data = [
  {icon: <FileTextIcon style={{width: '17px', height: '17px'}}/>, color: 'blue', label: 'Articles', link: "/admin/articles"},
  {icon: <RocketIcon style={{width: '17px', height: '17px'}}/>, color: 'teal', label: 'Trips', link: "/admin/trips"},
  {icon: <User size={17}/>, color: 'violet', label: 'Users', link: "/admin/users"},
  {icon: <World size={17} />, color: 'grape', label: 'Map', link: "/admin/map"},
  {icon: <MessageDots size={17} />, color: 'blue', label: 'Chat', link: "/admin/chat"},
  {icon: <ReaderIcon style={{width: '17px', height: '17px'}}/>, color: 'teal', label: 'Languages', link: "/admin/languages"},
  {icon: <SewingPinFilledIcon style={{width: '17px', height: '17px'}}/>, color: 'violet', label: 'Countries', link: "/admin/countries"},
  {icon: <Link2Icon style={{width: '17px', height: '17px'}}/>, color: 'grape', label: 'Tags', link: "/admin/tags"},
  {icon: <InfoCircle size={17}/>, color: 'grape', label: 'Complaints', link: "/admin/complaints"},
];

export function MainLinks({matches}: any) {
  const links = data.map((link) => <MainLink matches={matches} {...link} key={link.label}/>);
  return <div>{links}</div>;
}
