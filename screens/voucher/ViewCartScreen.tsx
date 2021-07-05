import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Image,
    KeyboardAvoidingView,
    FlatList,
  } from "react-native";
import DraggablePanel from "react-native-draggable-panel";
import Colors from "../../constants/Colors";
import MyWindow from "../../constants/Layout";
import { Block, Button, Text, Icon, Input, theme } from "galio-framework";

const viewCartPanel = (props)=>(
    <DraggablePanel
        visible={props.data}
        hideable={false}
    >
          <Icon
          name="close"
          family="FontAwesome"
          color={Colors.base}
          size={40}
          style={styles.close_button}
          onPress={() => props.passedSetState(false)}
        />

    </DraggablePanel>
)


const styles = StyleSheet.create({
    close_button: {
        left: (MyWindow.Width / 100) * 85,
        right: 0,
        top: 0,
        bottom: 0,
        position: "relative",
      },

});




export {viewCartPanel};