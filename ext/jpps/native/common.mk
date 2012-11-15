ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=jpps
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

override CCFLAGS := $(filter-out -Werror , $(CCFLAGS))

EXTRA_SRCVPATH+=$(WEBWORKS_DIR)/ext/jpps/native/src/utils \
				$(WEBWORKS_DIR)/ext/jpps/native/src/core \
				$(WEBWORKS_DIR)/ext/jpps/native/src/plugin

EXTRA_INCVPATH+=$(WEBWORKS_DIR)/ext/jpps/native/src/utils \
				$(WEBWORKS_DIR)/ext/jpps/native/src/core \
				$(WEBWORKS_DIR)/ext/jpps/native/src/plugin

SRCS+=src/utils/Thread.cpp \
      src/core/PPSInterface.cpp \
      src/core/PPSNotifier.cpp \
      src/core/PPSNotifyGroupManager.cpp \
      src/plugin/JPPSPlugin.cpp \
      src/plugin/PPSInterfaceGlue.cpp \
      src/plugin/JPPSServerPlugin.cpp \
      src/plugin/PPSServerGlue.cpp \
      src/plugin/pluginManifest.cpp

include $(MKFILES_ROOT)/qtargets.mk

LIBS+=pps
