import { Tag, TagCloseButton, TagLabel, TagProps } from "@chakra-ui/react";

type CloseableTagProps = TagProps & {
  onClose?: () => void;
  isDisabled?: boolean;
  isCloseable?: boolean;
};

export const CloseableTag = ({
  children,
  onClose,
  isCloseable = true,
  isDisabled = false,
  variant = "subtle",
  ...rest
}: CloseableTagProps) => {
  return (
    <Tag {...rest} variant={isDisabled ? "outline" : variant}>
      <TagLabel>{children}</TagLabel>
      {isCloseable ? <TagCloseButton onClick={onClose} /> : <></>}
    </Tag>
  );
};
