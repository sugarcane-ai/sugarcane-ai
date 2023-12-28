import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { api } from "~/utils/api";
import { signIn, useSession } from "next-auth/react";

interface LikeButtonProps {
  EntityId: string;
  EntityType: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ EntityId, EntityType }) => {
  const { data } = api.like.getLikes.useQuery({
    EntityId,
    EntityType,
  });

  const [counter, setCounter] = useState<number>(
    data?.likesCount != null ? data.likesCount : 0,
  );
  const [hasLiked, setHasLiked] = useState(false);
  const [LikeId, setLikeId] = useState<string>("");

  useEffect(() => {
    data?.likes.some((like) => {
      if (like.userId === sessionData?.user.id) {
        setHasLiked(true);
        setLikeId(like.likeId!);
      }
    });

    if (data?.likesCount != null) {
      setCounter(data.likesCount);
    }
  }, [data?.likesCount]);

  const UpdateMutation = api.like.createLike.useMutation();

  const { data: sessionData } = useSession();
  const handleLikeClick = async () => {
    console.log(data?.likesCount);
    console.log(data?.likes);

    UpdateMutation.mutate(
      {
        EntityId,
        EntityType,
        hasLiked,
        LikeId,
      },
      {
        onSuccess() {
          console.log("Likes Updated");
        },
        onError(error) {
          const errorData = JSON.parse(error.message);
          console.log("error: ", errorData);
        },
      },
    );

    if (hasLiked) {
      setCounter(counter! - 1);
      setHasLiked(!hasLiked);
    } else {
      setCounter(counter! + 1);
      setHasLiked(!hasLiked);
    }
  };

  return (
    <div>
      <ButtonGroup
        variant="outlined"
        color="inherit"
        size="small"
        sx={{ color: "#FFFFFF" }}
      >
        <Button
          size="small"
          startIcon={<FavoriteIcon />}
          onClick={() => (sessionData != null ? handleLikeClick() : signIn())}
        >
          Like
        </Button>
        <Button sx={{ cursor: "default", pointerEvents: "none" }}>
          {counter} Likes
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LikeButton;
