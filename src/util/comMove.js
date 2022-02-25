export const aiMove = (ballPos, max, min, dir) => {
    return (
        Math.min(
        372,
            Math.max(
                70,
                ballPos -
                40 +
                dir[Math.round(Math.random())] *
                    Math.floor(Math.random() * (max - min + 1) + min)
            )
        )
    )
}