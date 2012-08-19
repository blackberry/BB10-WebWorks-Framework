cmake_minimum_required(VERSION 2.8)

include_directories(${CMAKE_SOURCE_DIR})
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/../../../ui.dialog/native/)
include_directories(${CMAKE_SOURCE_DIR}/dependencies/jnext_1_0_8_3/jncore/jnext-extensions/common)
include_directories(${CMAKE_SOURCE_DIR}/dependencies/JsonCpp/jsoncpp-src-0.5.0/include)
include_directories(${CMAKE_SOURCE_DIR}/dependencies/gmock-1.5.0/fused-src/)

if (CMAKE_COMPILER_IS_GNUCC)
    set(CMAKE_CXX_FLAGS "-Werror -fexceptions -lang-c++ ${CMAKE_CXX_FLAGS}")
    set(CMAKE_C_FLAGS "-Werror ${CMAKE_C_FLAGS}")
endif ()

set(srcs
    test_main.cpp
    ../filetransfer_curl.cpp
    ../../../ui.dialog/native/dialog_bps.cpp
    ../../../../dependencies/gmock-1.5.0/fused-src/gmock-gtest-all.cc
)

add_executable(filetransferTest ${srcs})

target_link_libraries(filetransferTest m curl bps)
set_target_properties(filetransferTest PROPERTIES PREFIX "" OUTPUT_NAME "test")
