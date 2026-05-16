import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Linking, View as DefaultView } from 'react-native';
import { Text, View, Card } from './Themed';
import { Play, Download, ExternalLink, Video, FileText } from 'lucide-react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from 'react-native';
import { Resource } from '../constants/Resources';

interface ResourceCardProps {
  resource: Resource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const theme = useColorScheme() ?? 'light';
  const colors = Colors[theme];

  const handleOpen = () => {
    Linking.openURL(resource.url);
  };

  return (
    <Card style={[styles.container, { borderColor: colors.border }]}>
      <View style={styles.content}>
        {resource.type === 'video' ? (
          <View style={styles.thumbnailContainer}>
            {resource.thumbnail ? (
              <Image source={{ uri: resource.thumbnail }} style={styles.thumbnail} />
            ) : (
              <View style={[styles.placeholder, { backgroundColor: colors.primary + '20' }]}>
                <Video size={32} color={colors.primary} />
              </View>
            )}
            <TouchableOpacity onPress={handleOpen} style={styles.playOverlay}>
              <Play size={24} color="#FFF" fill="#FFF" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.pdfIcon, { backgroundColor: '#FF4B4B15' }]}>
             <FileText size={40} color="#FF4B4B" />
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.headerRow}>
            <Text style={styles.typeLabel}>{resource.type.toUpperCase()}</Text>
            {resource.courseCode && (
              <Text style={[styles.courseCode, { color: colors.primary }]}>{resource.courseCode}</Text>
            )}
          </View>
          <Text style={styles.title} numberOfLines={1}>{resource.title}</Text>
          <Text style={[styles.desc, { color: colors.secondaryText }]} numberOfLines={2}>
            {resource.description}
          </Text>
          
          <TouchableOpacity 
            onPress={handleOpen}
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          >
            {resource.type === 'video' ? (
              <>
                <Text style={styles.actionText}>Watch Now</Text>
                <ExternalLink size={14} color="#FFF" />
              </>
            ) : (
              <>
                <Text style={styles.actionText}>Download PDF</Text>
                <Download size={14} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 12,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnailContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfIcon: {
    width: 100,
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeLabel: {
    fontSize: 10,
    fontWeight: '900',
    opacity: 0.5,
    letterSpacing: 0.5,
  },
  courseCode: {
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
