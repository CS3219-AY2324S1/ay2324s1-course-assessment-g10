import { Tag, TagCloseButton, TagLabel, TagProps } from "@chakra-ui/react";

type CloseableTagProps = TagProps & {
  onClose?: () => void;
  isCloseable?: boolean;
};

export const CloseableTag = ({
  children,
  onClose,
  isCloseable = true,
  ...rest
}: CloseableTagProps) => {
  return (
    <Tag {...rest}>
      <TagLabel>{children}</TagLabel>
      {isCloseable ? <TagCloseButton onClick={onClose} /> : <></>}
    </Tag>
  );
};
