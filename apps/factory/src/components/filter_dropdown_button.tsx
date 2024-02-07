import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { FilterOrder, filterOrder } from "~/validators/prompt_package";

type FilterDropdownButtonProps = {};

const FilterDropdownButton: React.FC<FilterDropdownButtonProps> = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleFilter = (order: FilterOrder) => {
    setAnchorEl(null);
    router.push({
      query: { ...router.query, order },
    });
  };

  return (
    <div style={{ paddingTop: "25px", paddingBottom: "5px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          color="warning"
          onClick={(event: React.MouseEvent<HTMLElement>) =>
            setAnchorEl(event.currentTarget)
          }
        >
          Filter
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => handleFilter(filterOrder.Enum.desc)}>
          Latest Packages
        </MenuItem>
        <MenuItem onClick={() => handleFilter(filterOrder.Enum.asc)}>
          Oldest Packages
        </MenuItem>
      </Menu>
    </div>
  );
};
export default FilterDropdownButton;
