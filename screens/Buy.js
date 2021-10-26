import React from 'react';
import { Image, View, Text, TouchableOpacity, Clipboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import discordIcon from '../assets/discordIcon.png';
import instagramIcon from '../assets/instagramIcon.png';
import whatsAppIcon from '../assets/whatsAppIcon.png';
import copyIcon from '../assets/copy_icon.png';

export default function Buy({ route }) {
  const navigation = useNavigation();

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
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#121212',

              borderRadius: 4,
              marginTop: 28,
              paddingVertical: 10,
              paddingHorizontal: 18,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={discordIcon}
                style={{ width: 38, height: 38, marginRight: 10 }}
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

            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(discordContact);
              }}>
              <Image
                source={copyIcon}
                style={{
                  aspectRatio: 63 / 63,
                  width: 30,
                  height: undefined,
                }}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {instagramContact ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#121212',

              borderRadius: 4,
              marginTop: 28,
              paddingVertical: 10,
              paddingHorizontal: 18,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={instagramIcon}
                style={{ width: 38, height: 38, marginRight: 10 }}
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

            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(instagramContact);
              }}>
              <Image
                source={copyIcon}
                style={{
                  aspectRatio: 63 / 63,
                  width: 30,
                  height: undefined,
                }}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        {whatsAppContact ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#121212',

              borderRadius: 4,
              marginTop: 28,
              paddingVertical: 10,
              paddingHorizontal: 18,
            }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={whatsAppIcon}
                style={{ width: 38, height: 38, marginRight: 10 }}
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

            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(whatsAppContact);
              }}>
              <Image
                source={copyIcon}
                style={{
                  aspectRatio: 63 / 63,
                  width: 30,
                  height: undefined,
                }}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}
