import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Vibration,
  Animated,
  Easing,
  ImageBackground,
} from "react-native";

import { Video } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

import chestImage from "../assets/img/chest.png";
import bombImage from "../assets/img/bomb.gif";
import smallBombIcon from "../assets/img/bomb.gif"; // Path to your small bomb icon
import SoundManager from "../managers/SoundManager"; // Adjust the path as per your directory structure

const Grid = () => {
  const gridSize = 5; // 5 columns and 6 rows
  const [bombPositions, setBombPositions] = useState([]);
  const [chestPosition, setChestPosition] = useState(0);
  const [showValues, setShowValues] = useState(false); // Default to true
  const [clickedItems, setClickedItems] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [questionMarkItems, setQuestionMarkItems] = useState(new Set());

  const [consecutiveChests, setConsecutiveChests] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const updatedQuestionMarkItems = new Set(questionMarkItems);

  const [firstClick, setFirstClick] = useState(true);

  const [showImage, setShowImage] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current; // Assuming 300 is off-screen to the right
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [gameOutcome, setGameOutcome] = useState(null);

  const [showSpadeAnimation, setShowSpadeAnimation] = useState(false);
  const [spadeAnimationPosition, setSpadeAnimationPosition] = useState({
    x: 0,
    y: 0,
  });

  const [isAnimating, setIsAnimating] = useState(false);

  const gridContainerWidth = 364; // Adjust this to match your grid container's width
  const gridItemMargin = 1; // Margin around each grid item

  // Calculate the width and height of each grid item
  const gridItemWidth =
    (gridContainerWidth - (gridSize + 1) * gridItemMargin * 2) / gridSize;
  const gridItemHeight = gridItemWidth; // If grid items are squares

  const [clickedIndex, setClickedIndex] = useState(null);

  const [shouldAnimateButton, setShouldAnimateButton] = useState(false);

  const storeHighScore = async (score) => {
    try {
      await AsyncStorage.setItem("HIGH_SCORE", JSON.stringify(score));
    } catch (error) {
      // Error saving data
      console.log(error);
    }
  };

  const calculateStepsToChest = (index) => {
    const chestRow = Math.ceil(chestPosition / gridSize);
    const chestCol =
      chestPosition % gridSize === 0 ? gridSize : chestPosition % gridSize;

    const row = Math.ceil(index / gridSize);
    const col = index % gridSize === 0 ? gridSize : index % gridSize;

    const verticalSteps = Math.abs(chestRow - row);
    const horizontalSteps = Math.abs(chestCol - col);
    const diagonalSteps = Math.min(verticalSteps, horizontalSteps);

    return verticalSteps + horizontalSteps - diagonalSteps;
  };

  const shouldContinueAnimation = useRef(true);

  const startButtonAnimation = () => {
    // Sequence to scale up and down
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1, // Scale up a bit
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Scale back down
        duration: 500,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
    ]).start(() => {
      // Check the current value of the ref to decide whether to continue
      if (shouldContinueAnimation.current) {
        startButtonAnimation();
      } else {
        scaleAnim.setValue(1); // Reset scale if not continuing
      }
    });
  };

  useEffect(() => {
    if (gameOutcome === "win" || gameOutcome === "lose") {
      shouldContinueAnimation.current = true;
      startButtonAnimation();
    } else if (gameOutcome === "new") {
      shouldContinueAnimation.current = false;
    }
  }, [gameOutcome]);

  useEffect(() => {
    let animation;

    if (showImage) {
      animation = Animated.timing(slideAnim, {
        toValue: 0, // Slide in
        duration: 500,
        useNativeDriver: true,
      });

      animation.start(() => {
        // After sliding in, start a timer to slide out
        setTimeout(() => {
          Animated.timing(slideAnim, {
            toValue: 300, // Slide out
            duration: 500,
            useNativeDriver: true,
          }).start(() => setShowImage(false)); // Hide the image after animation
        }, 4000); // Duration of image visibility
      });
    } else {
      slideAnim.setValue(300); // Reset to initial position
    }

    // Cleanup function
    return () => {
      if (animation) {
        animation.stop(); // Stop the active animation
      }
      // Remove all listeners from slideAnim
      slideAnim.removeAllListeners();
    };
  }, [showImage, slideAnim]);

  useEffect(() => {
    // Start a new game when the component mounts or when isGameInProgress is false
    if (!startGame) {
      handleStartButtonClick();
    }

    const loadHighScore = async () => {
      try {
        const storedHighScore = await AsyncStorage.getItem("HIGH_SCORE");
        if (storedHighScore !== null) {
          setHighScore(JSON.parse(storedHighScore));
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };

    loadHighScore();
  }, [startGame]);

  useEffect(() => {
    const loadConsecutiveChests = async () => {
      try {
        const value = await AsyncStorage.getItem("CONSECUTIVE_CHESTS");
        if (value !== null) {
          setConsecutiveChests(parseInt(value, 10));
        }
      } catch (error) {
        // Error retrieving data
        console.error(error);
      }
    };

    loadConsecutiveChests();
  }, []);

  const isAdjacentToBomb = (index) => {
    const row = Math.ceil(index / gridSize);
    const col = index % gridSize === 0 ? gridSize : index % gridSize;

    for (const bombIndex of bombPositions) {
      const bombRow = Math.ceil(bombIndex / gridSize);
      const bombCol =
        bombIndex % gridSize === 0 ? gridSize : bombIndex % gridSize;

      const rowDiff = Math.abs(bombRow - row);
      const colDiff = Math.abs(bombCol - col);

      if (rowDiff <= 1 && colDiff <= 1) {
        return true;
      }
    }

    return false;
  };

  const renderGridItems = () => {
    const bombCounts = {}; // To store the number of adjacent bombs for each item

    // First loop to calculate bomb counts
    for (let i = 1; i <= gridSize * gridSize; i++) {
      bombCounts[i] = 0; // Initialize bomb count for each item

      if (bombPositions.includes(i)) {
        continue; // Skip bombs, as they don't need counting
      }

      const row = Math.ceil(i / gridSize);
      const col = i % gridSize === 0 ? gridSize : i % gridSize;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
          const neighborRow = row + rowOffset;
          const neighborCol = col + colOffset;
          const neighborIndex = (neighborRow - 1) * gridSize + neighborCol;

          if (
            neighborRow > 0 &&
            neighborRow <= gridSize &&
            neighborCol > 0 &&
            neighborCol <= gridSize &&
            bombPositions.includes(neighborIndex)
          ) {
            bombCounts[i]++;
          }
        }
      }
    }

    // Second loop to set styles based on bomb counts
    const items = [];
    for (let i = 1; i <= gridSize * gridSize; i++) {
      let itemStyle = styles.gridItem;
      let textColorStyle = styles.gridItemText;

      if (bombPositions.includes(i)) {
        textColorStyle = styles.bombText;
      } else if (i === chestPosition) {
        itemStyle = [styles.gridItem, styles.chestItem];
        textColorStyle = styles.chestText;
      } else {
        const adjacentBombCount = bombCounts[i];
        if (adjacentBombCount === 1) {
          textColorStyle = styles.adjacentBombText1;
        } else if (adjacentBombCount === 2) {
          textColorStyle = styles.adjacentBombText2;
        } else if (adjacentBombCount === 3) {
          textColorStyle = styles.adjacentBombText3;
        } else if (adjacentBombCount === 4) {
          textColorStyle = styles.adjacentBombText4;
        } else if (adjacentBombCount === 5) {
          textColorStyle = styles.adjacentBombText5;
        } else if (adjacentBombCount === 6) {
          textColorStyle = styles.adjacentBombText6;
        } else if (adjacentBombCount === 7) {
          textColorStyle = styles.adjacentBombText7;
        } else if (adjacentBombCount === 8) {
          textColorStyle = styles.adjacentBombText8;
        }
      }

      // Check if the item has a question mark
      const hasQuestionMark = questionMarkItems.has(i);
      const index = i;
      const isClickedItem = index === clickedIndex;

      items.push(
        <TouchableOpacity
          key={i}
          style={[itemStyle, hasQuestionMark ? styles.questionMarkItem : null]}
          onPress={() => handleGridItemClick(i)}
          onLongPress={() => handleLongPress(i)}
        >
          <ImageBackground
            source={require("../assets/img/sand_bg2.jpg")} // Replace with your image path
            style={styles.backgroundImage}
            resizeMode="cover" // or 'contain', depending on your needs
          >
            {isClickedItem && (
              <>
                {console.log("hey")}
                <Image
                  source={require("../assets/img/shovel2.gif")}
                  style={styles.shovelImage}
                />
              </>
            )}
            <Text style={[textColorStyle, styles.textShadow]}>
              {(() => {
                if (showValues || clickedItems.includes(i)) {
                  if (bombPositions.includes(i)) {
                    return (
                      <Image source={bombImage} style={styles.chestImage} />
                    );
                  } else if (i === chestPosition) {
                    return (
                      <Image source={chestImage} style={styles.chestImage} />
                    );
                  } else {
                    return calculateStepsToChest(i);
                  }
                }
                return ""; // Return an empty string when showValues is false or for other items
              })()}

              {hasQuestionMark && ""}
            </Text>
          </ImageBackground>
        </TouchableOpacity>
      );
    }

    return items;
  };

  const handleLongPress = (index) => {
    // Toggle the presence of a question mark on the item

    if (questionMarkItems.has(index)) {
      updatedQuestionMarkItems.delete(index);
    } else {
      updatedQuestionMarkItems.add(index);
    }
    setQuestionMarkItems(updatedQuestionMarkItems);
    Vibration.vibrate(5000);
  };

  // Use useEffect to log the updated state
  useEffect(() => {}, [questionMarkItems]);

  useEffect(() => {
    // Force a re-render or perform an action when questionMarkItems changes
  }, [questionMarkItems]);

  const handleStartButtonClick = () => {
    setFirstClick(true);
    setMoves(0);
    setQuestionMarkItems(new Set());
    const newBombPositions = [];
    let newChestPosition;

    const randomBombNumber = Math.floor(Math.random() * 5) + 2;

    // Generate bomb positions
    while (newBombPositions.length < randomBombNumber) {
      const randomPosition =
        Math.floor(Math.random() * (gridSize * gridSize)) + 1;
      if (
        !newBombPositions.includes(randomPosition) &&
        randomPosition !== newChestPosition
      ) {
        newBombPositions.push(randomPosition);
      }
    }

    // Generate chest position
    do {
      newChestPosition = Math.floor(Math.random() * (gridSize * gridSize)) + 1;
    } while (newBombPositions.includes(newChestPosition));

    setBombPositions(newBombPositions);
    setChestPosition(newChestPosition);
    setShowValues(false);
    setClickedItems([]);
    setGameOver(false);
    setGameOutcome("new");

    // Select one random bomb position to be visible at start
    const randomBombToShow =
      newBombPositions[Math.floor(Math.random() * newBombPositions.length)];
    setClickedItems([randomBombToShow]); // Add this bomb to the clicked items
  };

  const handleGridItemClick = (index) => {
    if (clickedIndex || questionMarkItems.has(index)) {
      // If it's question marked, do nothing
      console.log("Item is question marked, cannot open it.");
      return;
    }
    SoundManager.playClick();
    if (gameOver === true) {
      setShowValues(true);
      Alert.alert("Oops!", "Start a new game");
    } else {
      // Check if the item has already been clicked
      if (clickedItems.includes(index)) {
        return;
      }

      setMoves(moves + 1);

      const row = Math.floor((index - 1) / gridSize);
      const col = (index - 1) % gridSize;
      const position = {
        x: col * gridItemWidth + col * (9 * gridItemMargin),
        y: row * gridItemHeight + row * (2 * gridItemMargin),
      };

      setClickedIndex(index);

      setTimeout(() => {
        setClickedIndex(null); // This will remove the shovel from the view

        // Rest of the item click logic
        // ...

        if (moves > 4 && index !== chestPosition) {
          SoundManager.playGameOver();
          setGameOver(true);
          setShowValues(true);
          Alert.alert(
            "Game Over",
            "You have reached the maximum number of moves."
          );
          // Reset consecutive chest count when the game is over
          setConsecutiveChests(20);
          setGameOutcome("lose");
          return;
        }

        if (!clickedItems.includes(index)) {
          setClickedItems([...clickedItems, index]);
        }

        if (bombPositions.includes(index)) {
          SoundManager.playBomb();
          if (firstClick) {
            setShowImage(true);
            SoundManager.playFCBomb();
          }
          SoundManager.playGameOver();
          setGameOver(true);
          setShowValues(true);
          // Reset consecutive chest count when a bomb is clicked
          setConsecutiveChests(0);
          setGameOutcome("lose");
        } else if (index === chestPosition) {
          setGameOver(true);
          SoundManager.playChest();
          if (firstClick) {
            SoundManager.playFCChest();
          }
          setGameOutcome("win");
          Alert.alert("Congratulations!", "You found the chest!");
          setShowValues(true);
          // Increase consecutive chest count when the chest is found
          setConsecutiveChests(consecutiveChests + 1);

          // Update high score if the current score is higher than the stored high score
          if (consecutiveChests >= highScore) {
            setHighScore(consecutiveChests + 1);

            // Store the updated high score in AsyncStorage
            storeHighScore(consecutiveChests + 1);
          }

          // Check for 3, 6, and 10 consecutive chests
          if (consecutiveChests === 2) {
            // User has opened 3 in a row
            SoundManager.play3iar();
            console.log("3 in a row");
            // Implement your logic here for 3 in a row
          } else if (consecutiveChests === 5) {
            // User has opened 6 in a row
            // Implement your logic here for 6 in a row
          } else if (consecutiveChests === 9) {
            // User has opened 10 in a row
            // Implement your logic here for 10 in a row
          }

          // Save the updated consecutive chest count to AsyncStorage
          AsyncStorage.setItem(
            "CONSECUTIVE_CHESTS",
            (consecutiveChests + 1).toString()
          )
            .then(() => {
              console.log("Consecutive chests count saved successfully.");
            })
            .catch((error) => {
              console.error("Error saving consecutive chests count: ", error);
            });
        } else {
          setFirstClick(false);
          console.log(
            "Not yet!",
            `Steps to the chest: ${calculateStepsToChest(index)}`
          );
        }
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      {showImage && (
        <Animated.View
          style={[
            styles.animatedImageContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Image
            source={require("../assets/img/suprised_bomb.png")}
            style={styles.animatedImage}
          />
        </Animated.View>
      )}

      <View style={styles.highScoreContainer}>
        <Text style={styles.highScoreNumber}>{highScore}</Text>
        <Text style={styles.highScoreLabel}>High Score</Text>
      </View>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartButtonClick}
        >
          <Text style={styles.startButtonText}>
            {gameOutcome === "win"
              ? "Continue"
              : gameOutcome === "lose"
              ? "Play again"
              : gameOutcome === "new"
              ? "New game"
              : "Start"}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.toggleValuesButton}
        onPress={() => setShowValues(!showValues)}
      >
        <Text style={styles.startButtonText}>
          {showValues ? "Hide Values" : "Show Values"}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          ...styles.movesLeftText,
          color: moves === 5 ? "red" : "white",
        }}
      >
        Clicks left: {moves === 5 ? "1!" : 6 - moves}
      </Text>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{consecutiveChests}</Text>
        <Text style={styles.smallText}>IN A ROW</Text>
      </View>

      <View style={styles.gridContainer}>{renderGridItems()}</View>
      <View style={styles.bombCountContainer}>
        <Image source={smallBombIcon} style={styles.smallBombIcon} />
        <Text style={styles.bombCountText}>
          {bombPositions.length - questionMarkItems.size}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animatedImageContainer: {
    position: "absolute",
    top: 120,
    right: 0,
  },

  animatedImage: {
    width: 100,
    height: 100,
  },

  container: {
    flex: 1,
    marginTop: 50,
  },
  gridContainer: {
    height: 364,
    backgroundColor: "black",
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 2,
    borderColor: "white",
    marginTop: 100,
  },
  gridItem: {
    width: "19.48%",
    height: 70,
    margin: 1,
    //backgroundColor: "#FFD2A6",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  bombText: {
    color: "red",
    fontSize: 20,
  },
  chestItem: {
    //backgroundColor: "grey",
  },
  chestText: {
    color: "gold",
    fontSize: 20,
  },
  adjacentToBombText: {
    color: "red",
    fontSize: 20,
  },
  gridItemText: {
    color: "white",
    fontSize: 20,
  },
  startButton: {
    padding: 10,
    backgroundColor: "green",
    alignSelf: "center",
    marginBottom: 10,
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },
  toggleValuesButton: {
    padding: 10,
    backgroundColor: "blue",
    alignSelf: "center",
    marginBottom: 10,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
  },
  chestImage: {
    width: 40,
    height: 40,
  },
  movesLeftText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },
  adjacentBombText1: {
    color: "yellow",
    fontSize: 20,
  },

  adjacentBombText2: {
    color: "orange",
    fontSize: 20,
  },
  adjacentBombText3: {
    color: "red",
    fontSize: 20,
  },
  adjacentBombText4: {
    color: "brown",
    fontSize: 20,
  },
  adjacentBombText5: {
    color: "blue",
    fontSize: 20,
  },
  adjacentBombText6: {
    color: "green",
    fontSize: 20,
  },
  adjacentBombText7: {
    color: "darkgrey",
    fontSize: 20,
  },
  adjacentBombText8: {
    color: "black",
    fontSize: 20,
  },

  questionMarkItem: {
    borderColor: "red", // Customize the border color for the question mark item
    borderWidth: 5,
  },
  scoreContainer: {
    width: "30%",
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "column",
    alignItems: "flex-end",
    textAlign: "center",
  },

  scoreText: {
    width: "100%",
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },

  smallText: {
    width: "100%",
    color: "white",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },

  bombCountText: {
    fontSize: 18,
    color: "white",
    textAlign: "left",
    marginLeft: 10, // Adjust as needed for your layout
    marginTop: 10,
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },
  bombCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10, // Adjust as needed
    marginTop: 10,
  },
  smallBombIcon: {
    width: 20, // Adjust size as needed
    height: 20, // Adjust size as needed
    marginRight: 5, // Space between icon and text
  },
  bombCountText: {
    fontSize: 18,
    color: "white",
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },

  highScoreContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    alignItems: "flex-start",
  },
  highScoreText: {
    fontSize: 18,
    color: "white",
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },

  highScoreContainer: {
    position: "absolute",
    top: 10,
    left: 30,
    alignItems: "center",
  },
  highScoreNumber: {
    fontSize: 24, // Larger font size for the number
    color: "white",
    fontWeight: "bold",
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },
  highScoreLabel: {
    fontSize: 18,
    color: "white",
    textShadowColor: "#000", // Shadow color
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset (adjust as needed)
    textShadowRadius: 4, // Shadow radius (adjust as needed)
  },
  shovelImage: {
    width: "85%",
    height: "85%",
    marginTop: 10,
    zIndex: 1,
    // Adjust styling as needed
  },
  textShadow: {
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});

export default Grid;
