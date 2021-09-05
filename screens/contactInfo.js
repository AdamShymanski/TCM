import React from 'react';
import { Image, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import discordIcon from '../assets/discordIcon.png';
import instagramIcon from '../assets/instagramIcon.png';
import whatsAppIcon from '../assets/whatsAppIcon.png';

export const ContactInfo = ({ route }) => {
  const navigation = useNavigation();
  console.log(route.params);

  const discordContact = route.params.discordContact;
  const instagramContact = route.params.instagramContact;
  const whatsAppContact = route.params.whatsAppContact;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1b1b1b',
      }}>
      <Text
        style={{
          color: '#f4f4f4',
          fontSize: 38,
          fontWeight: '700',
          marginBottom: 6,
        }}>
        Contact with seller!
      </Text>
      <Text
        style={{
          color: '#4f4f4f',
          fontSize: 15,
          width: '88%',
          marginBottom: 60,
          textAlign: 'center',
        }}>
        We don't support in-app purchases yet, but you can contact the seller
        via WhatsApp, Instagram or Discord to buy the card and learn more
        details about it.
      </Text>
      <View style={{ width: '80%' }}>
        {discordContact ? (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              borderColor: '#1b1b1b',
              borderBottomColor: '#5c5c5c',
              paddingBottom: 16,
              borderRadius: 2,
              borderWidth: 2,
            }}>
            <Image
              source={discordIcon}
              style={{ width: 38, height: 38, marginRight: 18 }}
            />
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: '#121212',
                borderRadius: 3,
              }}>
              <Text
                style={{ color: '#f4f4f4', fontSize: 20, fontWeight: '700' }}>
                {discordContact}
              </Text>
            </View>
          </View>
        ) : null}
        {instagramContact ? (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              borderColor: '#1b1b1b',
              borderBottomColor: '#5c5c5c',
              paddingBottom: 16,
              borderRadius: 2,
              borderWidth: 2,
              marginTop: 28,
            }}>
            <Image
              source={instagramIcon}
              style={{ width: 38, height: 38, marginRight: 18 }}
            />
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: '#121212',
                borderRadius: 3,
              }}>
              <Text
                style={{ color: '#f4f4f4', fontSize: 20, fontWeight: '700' }}>
                {instagramContact}
              </Text>
            </View>
          </View>
        ) : null}
        {whatsAppContact ? (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              borderColor: '#1b1b1b',
              borderBottomColor: '#5c5c5c',
              paddingBottom: 16,
              borderRadius: 2,
              borderWidth: 2,
              marginTop: 28,
            }}>
            <Image
              source={whatsAppIcon}
              style={{ width: 38, height: 38, marginRight: 18 }}
            />
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: '#121212',
                borderRadius: 3,
              }}>
              <Text
                style={{ color: '#f4f4f4', fontSize: 20, fontWeight: '700' }}>
                {whatsAppContact}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
};
