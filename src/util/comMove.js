export const aiMove = (upper_limit, lower_limit, ballPos, max, min, dir) => {
  return Math.min(
    upper_limit,
    Math.max(
      lower_limit,
      ballPos -
        40 
        + dir[Math.round(Math.random())] *
          Math.floor(Math.random() * (max - min + 1) + min)
    )
  );
};