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
  const likesCount = api.like.getLikes.useQuery({
    EntityId,
    EntityType,
  });

  const liked = api.like.UserLikeCheck.useQuery({
    EntityId,
    EntityType,
  });

  const UnlikeMutation = api.like.unlikeEntity.useMutation();
  const LikeMutation = api.like.likeEntity.useMutation();

  const [counter, setCounter] = useState<number>(
    likesCount.data?.likesCount != null ? likesCount.data.likesCount : 0,
  );
  const [loading, setLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (likesCount.data?.likesCount != null) {
      setCounter(likesCount.data.likesCount);
      if (sessionData?.user) {
        setHasLiked(liked.data?.hasLiked!);
      }
    }
  }, [likesCount.data?.likesCount]);

  const handleLikeClick = async () => {
    setLoading(true);
    console.log(likesCount.data?.likesCount);
    if (hasLiked) {
      UnlikeMutation.mutate(
        {
          EntityId,
          EntityType,
          LikeId: liked.data?.likeId!,
        },
        {
          onSuccess() {
            console.log("Likes Updated");
            setCounter(counter! - 1);
            setHasLiked((prevHasLiked) => !prevHasLiked);
            setLoading(false);
          },
          onError(error) {
            const errorData = JSON.parse(error.message);
            console.log("error: ", errorData);
          },
        },
      );
    } else {
      LikeMutation.mutate(
        {
          EntityId,
          EntityType,
        },
        {
          onSuccess() {
            console.log("Likes Updated");
            setCounter(counter! + 1);
            setHasLiked((prevHasLiked) => !prevHasLiked);
            setLoading(false);
          },
          onError(error) {
            const errorData = JSON.parse(error.message);
            console.log("error: ", errorData);
          },
        },
      );
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
          disabled={loading}
          size="small"
          startIcon={
            <FavoriteIcon
              sx={hasLiked ? { color: "red" } : { color: "white" }}
            />
          }
          onClick={() => (sessionData != null ? handleLikeClick() : signIn())}
        >
          {hasLiked ? "Liked" : "Like"}
        </Button>
        <Button sx={{ cursor: "default", pointerEvents: "none" }}>
          {counter} Likes
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default LikeButton;
