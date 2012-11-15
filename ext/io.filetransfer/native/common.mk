ifndef QCONFIG
QCONFIG=qconfig.mk
endif
include $(QCONFIG)

NAME=filetransfer
PLUGIN=yes
UTILS=yes

include ../../../../meta.mk

EXTRA_SRCVPATH+=../../../../ui.dialog/native

SRCS+=filetransfer_curl.cpp \
      filetransfer_js.cpp \
      ../../../../ui.dialog/native/dialog_bps.cpp

EXTRA_INCVPATH+=../../../../ui.dialog/native

ifeq ($(UNITTEST),yes)
NAME=test
SRCS+=test_main.cpp
USEFILE=
endif

LIBS+=bps curl

include $(MKFILES_ROOT)/qtargets.mk