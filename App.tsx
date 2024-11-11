import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, Modal, FlatList, TouchableOpacity, Alert } from 'react-native';

type Dish = {
  id: string;
  sname: string;
  description: string;
  price: string;
  category: string;
};

const DATA: Dish[] = [
  { id: '1', sname: 'Starters Menu', description: 'Dark chicken and sour cherry terrine...', price: 'R100.00', category: 'Starters' },
  { id: '2', sname: 'Main Course', description: 'Chicken Picatta meatballs...', price: 'R200.00', category: 'Main' },
  { id: '3', sname: 'Dessert', description: 'Carrot Cake...', price: 'R100.00', category: 'Dessert' },
];

type ItemProps = {
  sname: string;
  description: string;
  price: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ sname, description, price, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
    <Text style={styles.itemName}>{sname}</Text>
    <Text>{description}</Text>
    <Text style={styles.itemPrice}>{price}</Text>
  </TouchableOpacity>
);

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [chefModalVisible, setChefModalVisible] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedDishes, setSelectedDishes] = useState<Dish[]>([]);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);

  const openModal = (dish: Dish) => {
    setSelectedDish(dish);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDish(null);
  };

  const addDishToMenu = () => {
    if (selectedDish && !selectedDishes.some((dish) => dish.id === selectedDish.id)) {
      setSelectedDishes((prev) => [...prev, selectedDish]);
    }
    closeModal();
  };

  const removeDish = (dish: Dish) => {
    Alert.alert(
      "Remove Dish",
      "Are you sure you want to remove this dish?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "OK", onPress: () => setSelectedDishes((prev) => prev.filter((item) => item.id !== dish.id)) }
      ]
    );
  };

  const completeOrder = () => {
    setOrderComplete(true);
    setChefModalVisible(false);
  };

  const resetOrder = () => {
    setHasStarted(false);
    setSelectedDish(null);
    setSelectedDishes([]);
    setModalVisible(false);
    setChefModalVisible(false);
    setOrderComplete(false);
  };

  const calculateTotalCost = () => {
    return selectedDishes.reduce((total, dish) => total + parseFloat(dish.price.replace('R', '')), 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      {!hasStarted ? (
        <Button title="Start Ordering" onPress={() => setHasStarted(true)} />
      ) : (
        <>
          <Text style={styles.moduleList}>Menu</Text>

          <FlatList
            data={DATA}
            renderItem={({ item }) => (
              <Item
                sname={item.sname}
                description={item.description}
                price={item.price}
                onPress={() => openModal(item)}
              />
            )}
            keyExtractor={(item) => item.id}
          />

          <Modal
            animationType="slide"
            transparent={false}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalContainer}>
              {selectedDish ? (
                <>
                  <Text style={styles.modalTitle}>{selectedDish.sname}</Text>
                  <Text>{selectedDish.description}</Text>
                  <Text style={styles.itemPrice}>{selectedDish.price}</Text>
                  <Button title="Add to Menu" onPress={addDishToMenu} />
                  <Button title="Back to Menu" onPress={closeModal} />
                </>
              ) : (
                <Text style={styles.modalTitle}>No dish selected</Text>
              )}
            </View>
          </Modal>

          <Button title="View Added Menu (Chef)" onPress={() => setChefModalVisible(true)} />

          <Modal
            animationType="slide"
            transparent={false}
            visible={chefModalVisible}
            onRequestClose={() => setChefModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Added Dishes</Text>
              {selectedDishes.length > 0 ? (
                <FlatList
                  data={selectedDishes}
                  renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                      <Text style={styles.itemName}>{item.sname}</Text>
                      <Text>{item.description}</Text>
                      <Text style={styles.itemPrice}>{item.price}</Text>
                      <Button title="Remove" onPress={() => removeDish(item)} />
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
              ) : (
                <Text>No dishes added yet.</Text>
              )}
              <Text style={styles.totalCost}>Total Cost: R{calculateTotalCost()}</Text>
              <Button title="Complete Order" onPress={completeOrder} />
              <Button title="Close" onPress={() => setChefModalVisible(false)} />
            </View>
          </Modal>

          <Text style={styles.totalCourses}>Total Selected Items: {selectedDishes.length}</Text>

          {orderComplete && <Text style={styles.orderComplete}>Order complete! Thank you!</Text>}

          <Button title="Back to Start" onPress={resetOrder} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3b3cc',
    padding: 10,
    marginTop: 10,
  },
  moduleList: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 4,
    textAlign: 'center',
  },
  itemContainer: {
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  itemName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    color: '#ff3300',
  },
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalCourses: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  orderComplete: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    marginTop: 20,
  },
  totalCost: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
});
