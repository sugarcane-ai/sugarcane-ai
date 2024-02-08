import { Box, Button, Icon, Menu, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FilterOrder } from "~/validators/prompt_package";
import DoneIcon from "@mui/icons-material/Done";

export type MenuListItems = {
  text: string;
  order: FilterOrder;
};

type FilterDropdownButtonProps = {
  menuItems: MenuListItems[];
};

const FilterDropdownButton: React.FC<FilterDropdownButtonProps> = ({
  menuItems,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [sortingState, setSortingState] = useState(menuItems[0]?.text);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleFilter = (menuListItem: MenuListItems) => {
    setSortingState(menuListItem.text);
    setAnchorEl(null);
    const order = menuListItem.order;
    router.push({
      query: { ...router.query, order },
    });
  };

  return (
    <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
      <Box
        sx={{
          color: "white",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Button
          variant="outlined"
          size="small"
          color={anchorEl != null ? "primary" : "inherit"}
          onClick={(event: React.MouseEvent<HTMLElement>) =>
            setAnchorEl(event.currentTarget)
          }
        >
          Sort by :
          <span style={{ fontWeight: "bold", paddingLeft: "8px" }}>
            {sortingState}
          </span>
        </Button>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          elevation: 1,
          sx: {
            width: "232px",
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menuItems.map((menuItem, index) => (
          <MenuItem key={index} onClick={() => handleFilter(menuItem)}>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {menuItem.text === sortingState ? (
                <DoneIcon sx={{ paddingRight: "10px" }} />
              ) : (
                <Box sx={{ paddingLeft: "25px" }} />
              )}
              {menuItem.text}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
export default FilterDropdownButton;
