import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Text,
  Alert,
  Image,
} from "react-native";

import { Audio } from "expo-av"

import chestImage from "../assets/img/chest.png";
import bombImage from "../assets/img/bomb.gif";


const Grid = () => {
  const gridSize = 5; // 5 columns and 6 rows
  const [bombPositions, setBombPositions] = useState([]);
  const [chestPosition, setChestPosition] = useState(0);
  const [showValues, setShowValues] = useState(false); // Default to true
  const [clickedItems, setClickedItems] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);

  const playBomb = async () => {
    const {sound} = await Audio.Sound.createAsync(
      require("../assets/sound/bomb.mp3")
    );
    await sound.playAsync();
  }

  const playChest = async () => {
    const {sound} = await Audio.Sound.createAsync(
      require("../assets/sound/chest.mp3")
    );
    await sound.playAsync();
  }

  const playLastClick = async () => {
    const {sound} = await Audio.Sound.createAsync(
      require("../assets/sound/lastclick.mp3")
    );
    await sound.playAsync();
  }

  const playClick = async () => {
    const {sound} = await Audio.Sound.createAsync(
      require("../assets/sound/click.mp3")
    );
    await sound.playAsync();
  }
  

  const playFinished = async () => {
    const {sound} = await Audio.Sound.createAsync(
      require("../assets/sound/finished.mp3")
    );
    await sound.playAsync();
  }

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


  useEffect(() => {
    // Start a new game when the component mounts or when isGameInProgress is false
    if (!startGame) {
      handleStartButtonClick();
    }
  }, [startGame]);


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
    const items = [];
    for (let i = 1; i <= gridSize * gridSize; i++) {
      let itemStyle = styles.gridItem;
      let textColorStyle = styles.gridItemText;

      if (bombPositions.includes(i)) {
        textColorStyle = styles.bombText;
      } else if (i === chestPosition) {
        itemStyle = [styles.gridItem, styles.chestItem];
        textColorStyle = styles.chestText;
      } else if (isAdjacentToBomb(i)) {
        textColorStyle = styles.adjacentToBombText;
      }

      items.push(
        <TouchableOpacity
          key={i}
          style={itemStyle}
          onPress={() => handleGridItemClick(i)}
        >
          <Text style={textColorStyle}>
            {(() => {
              if (showValues || clickedItems.includes(i)) {
                if (bombPositions.includes(i)) {
                  return (
                    <Image
                      source={bombImage}
                      style={styles.chestImage}
                    />
                  );
                } else if (i === chestPosition) {
                  return (
                    <Image
                      source={chestImage}
                      style={styles.chestImage}
                    />
                  );
                } else {
                  return calculateStepsToChest(i);
                }
              }
              return ""; // Return an empty string when showValues is false or for other items
            })()}
          </Text>
        </TouchableOpacity>
      );
    }
    return items;
  };

  const handleStartButtonClick = () => {
    setMoves(0);
    setGameOver(false);
    const newBombPositions = [];
    let newChestPosition;
  
    // Generate bomb positions
    while (newBombPositions.length < 4) {
      const randomPosition = Math.floor(Math.random() * (gridSize * gridSize)) + 1;
      if (!newBombPositions.includes(randomPosition) && randomPosition !== newChestPosition) {
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
  };
  
  

  const handleGridItemClick = (index) => {
    playClick();
    if (gameOver === true) {
      setShowValues(true)
      Alert.alert("Game Over", "You already lost, start a new game");
    }else{
      
         // Check if the item has already been clicked
    if (clickedItems.includes(index)) {
      return;
    }
      setMoves(moves + 1);
      

    

      if (moves > 4 && index !== chestPosition) {
        playFinished()
        setGameOver(true);
        setShowValues(true)
        Alert.alert(
          "Game Over",
          "You have reached the maximum number of moves."
        );
        return;
      }


      if (!clickedItems.includes(index)) {
        setClickedItems([...clickedItems, index]);
      }

      if (bombPositions.includes(index)) {
        playBomb();
        setGameOver(true);
        setShowValues(true)
      } else if (index === chestPosition) {
        setGameOver(true);
        playChest();
        //Alert.alert("Congratulations!", "You found the chest!");
        setShowValues(true)
      } else {
        console.log(
          "Not yet!",
          `Steps to the chest: ${calculateStepsToChest(index)}`
        );
      }
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartButtonClick}
      >
        <Text style={styles.startButtonText}>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.toggleValuesButton}
        onPress={() => setShowValues(!showValues)}
      >
        <Text style={styles.startButtonText}>
          {showValues ? "Hide Values" : "Show Values"}
        </Text>
      </TouchableOpacity>
      <Text style={{...styles.movesLeftText, color: (moves === 5) ? 'red' : 'white'}}>Clicks left: {moves === 5 ? '1!' : 6-moves}</Text>
      <View style={styles.gridContainer}>
        <StatusBar translucent={true} backgroundColor="transparent" />
        {renderGridItems()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#228B22",
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
    color:'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default Grid;
