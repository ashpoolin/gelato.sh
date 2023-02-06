import { GitHub, Twitter } from "@mui/icons-material";
import { Button, IconButton } from "@mui/material";
import { Stack } from "@mui/system";

function Footer() {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={1}
      sx={{ width: "100%", padding: 1 }}
    >
      <Button href="/">&#169; {new Date().getFullYear()} gelato.sh</Button>
      <IconButton href="https://github.com/ashpoolin/gelato.sh">
        <GitHub />
      </IconButton>
      <IconButton href="https://twitter.com/solanobahn">
        <Twitter />
      </IconButton>
    </Stack>
  );
}

export default Footer;
