import React, {useEffect, useState} from 'react';

import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';

type Props = {
  visible: boolean;
  currentQuantity: number;
  onClose: () => void;
  onSave: (quantity: number) => void;
};

const quantities = [
  0.5,
  1,
  1.5,
  2,
];

const formatQuantity = (value: number) => {
  if (value === 0.5) {
    return '500 ml';
  }

  return `${value} L`;
};

const QuantitySelectorModal: React.FC<Props> = ({
  visible,
  currentQuantity,
  onClose,
  onSave,
}) => {

  const [selected, setSelected] =
    useState(currentQuantity);

  useEffect(() => {
    setSelected(currentQuantity);
  }, [currentQuantity, visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent>

      <View style={styles.overlay}>

        <View style={styles.sheet}>

          <Text style={styles.title}>
            Change Quantity
          </Text>

          {quantities.map(item => (

            <Pressable
              key={item}
              style={styles.option}
              onPress={() =>
                setSelected(item)
              }>

              <View
                style={[
                  styles.radio,
                  selected === item &&
                    styles.radioSelected,
                ]}
              />

              <Text style={styles.optionText}>
                {formatQuantity(item)}
              </Text>

            </Pressable>

          ))}

          <View style={styles.buttonRow}>

            <Pressable
              style={styles.cancelButton}
              onPress={onClose}>

              <Text style={styles.cancelText}>
                Cancel
              </Text>

            </Pressable>

            <Pressable
              style={styles.saveButton}
              onPress={() =>
                onSave(selected)
              }>

              <Text style={styles.saveText}>
                Save
              </Text>

            </Pressable>

          </View>

        </View>

      </View>

    </Modal>
  );
};

export default QuantitySelectorModal;

const styles = StyleSheet.create({

  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#17231C',
    marginBottom: 20,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#16794B',
    marginRight: 16,
  },

  radioSelected: {
    backgroundColor: '#16794B',
  },

  optionText: {
    fontSize: 16,
    color: '#17231C',
    fontWeight: '600',
  },

  buttonRow: {
    flexDirection: 'row',
    marginTop: 28,
  },

  cancelButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: '#DDE5DF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  saveButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#16794B',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  cancelText: {
    color: '#17231C',
    fontWeight: '700',
    fontSize: 16,
  },

  saveText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

});